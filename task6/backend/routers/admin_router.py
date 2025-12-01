from sqlalchemy import select, insert, update
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, Body, Response
from fastapi import UploadFile, File, Form
import pandas as pd
from io import BytesIO

from database import get_async_session
from models.models import pages, kpi, users, roles
from schemas.schemas import Page
from dependencies import admin_only
import json
from datetime import datetime


router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/create_page")
async def create_page(page: Page, session: AsyncSession = Depends(get_async_session)):
    stmt = insert(pages).values(
        title=page.title,
        content=page.content,
        path=page.path
    ).returning(pages.c.id)

    result = await session.execute(stmt)
    row = result.first()
    
    if not row:
        raise HTTPException(status_code=500, detail="Failed to create page")

    page_id = row.id

    kpi_stmt = insert(kpi).values(page_id=page_id, counter=0, time_spent=0)
    await session.execute(kpi_stmt)

    await session.commit()

    return {"status": "created", "page_id": page_id, "title": page.title, "path": page.path}


@router.get("/kpis", dependencies=[Depends(admin_only)])
async def get_kpis(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(
        select(kpi.c.page_id, kpi.c.counter, kpi.c.time_spent, pages.c.title, pages.c.path)
        .join(pages, kpi.c.page_id == pages.c.id)
    )
    rows = result.all()

    return [
        {
            "page_id": row.page_id,
            "title": row.title,
            "visits": row.counter,
            "time_spent_sec": row.time_spent,
            "time_spent": f"{row.time_spent // 60} мин {row.time_spent % 60} сек",
            "path": row.path
        }
        for row in rows
    ]



@router.post("/kpi/{page_id}/time")
async def add_time(
    page_id: int,
    seconds: int = Body(..., embed=True),  # FastAPI поймёт: ожидается JSON: {"seconds": 123}
    session: AsyncSession = Depends(get_async_session)
):
    stmt = update(kpi).where(kpi.c.page_id == page_id).values(
        time_spent = kpi.c.time_spent + seconds
    )
    await session.execute(stmt)
    await session.commit()
    return {"status": "success", "added_seconds": seconds}


@router.get("/page/by-path/{path}")
async def get_page_by_path(path: str, session: AsyncSession = Depends(get_async_session)):
    # Восстанавливаем путь с начальным слешом
    full_path = f"/{path}"
    print(f"Searching for full_path: '{full_path}'")

    result = await session.execute(
        select(pages.c.id, pages.c.title, pages.c.content)
        .where(pages.c.path == full_path)
    )
    page = result.first()
    print("Found:", page)

    if not page:
        raise HTTPException(status_code=404, detail="Page not found")

    stmt = update(kpi).where(kpi.c.page_id == page.id).values(counter=kpi.c.counter + 1)
    await session.execute(stmt)
    await session.commit()

    return {"id": page.id, "title": page.title, "content": page.content}


@router.get("/pages/paths")
async def get_tracked_paths(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(pages.c.path))
    rows = result.fetchall()
    paths = [row.path for row in rows] if rows else []
    return {"paths": paths}


@router.delete("/page/by-path/{path}")
async def delete_page_by_path(
    path: str,
    session: AsyncSession = Depends(get_async_session)
):
    # Всегда добавляем начальный слеш
    full_path = f"/{path.lstrip('/')}"  # Убираем лишние слеши и добавляем один
    print(f"Trying to delete page with path: '{full_path}'")

    result = await session.execute(
        select(pages.c.id).where(pages.c.path == full_path)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Page not found")

    page_id = row.id

    # Удаляем kpi
    await session.execute(
        kpi.delete().where(kpi.c.page_id == page_id)
    )
    # Удаляем страницу
    await session.execute(
        pages.delete().where(pages.c.id == page_id)
    )

    await session.commit()

    return {"status": "deleted", "path": full_path}


@router.get("/export-db", dependencies=[Depends(admin_only)])
async def export_db(session: AsyncSession = Depends(get_async_session)):
    """
    Экспорт всех данных из таблиц `pages` и `kpi` в JSON.
    Админ может скачать резервную копию.
    """
    # Получаем все страницы
    pages_result = await session.execute(select(pages))
    pages_data = [row._asdict() for row in pages_result.all()]

    # Получаем все KPI
    kpi_result = await session.execute(select(kpi))
    kpi_data = [row._asdict() for row in kpi_result.all()]

    # Формируем JSON
    export_data = {
        "pages": pages_data,
        "kpi": kpi_data,
        "_meta": {
            "exported_at": datetime.utcnow().isoformat(),
            "total_pages": len(pages_data),
            "total_kpi": len(kpi_data)
        }
    }

    # Возвращаем JSON как файл
    content = json.dumps(export_data, ensure_ascii=False, indent=2)
    return Response(
        content=content,
        media_type="application/json",
        headers={
            "Content-Disposition": 'attachment; filename="otd_backup.json"'
        }
    )


@router.get("/export-users", dependencies=[Depends(admin_only)])
async def export_users(session: AsyncSession = Depends(get_async_session)):
    """
    Экспорт всех пользователей и ролей в JSON.
    Админ может скачать копию.
    """
    # Получаем пользователей с email и ролью (имя роли через join)
    users_result = await session.execute(
        select(users.c.id, users.c.email, roles.c.name.label("role"))
        .join(roles, users.c.role_id == roles.c.id)
    )
    users_data = [row._asdict() for row in users_result.all()]

    # Формируем JSON
    export_data = {
        "users": users_data,
        "_meta": {
            "exported_at": datetime.utcnow().isoformat(),
            "total_users": len(users_data)
        }
    }

    content = json.dumps(export_data, ensure_ascii=False, indent=2)
    return Response(
        content=content,
        media_type="application/json",
        headers={
            "Content-Disposition": 'attachment; filename="otd_users_backup.json"'
        }
    )
