from sqlalchemy import select, insert, update
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException

from database import get_async_session
from models.models import pages, kpi
from schemas.schemas import Page

router = APIRouter(prefix="/admin", tags=["admin"])


@router.post("/create_page")
async def create_page(page: Page, session: AsyncSession = Depends(get_async_session)):
    # Явно указываем RETURNING id
    stmt = insert(pages).values(title=page.title, content=page.content).returning(pages.c.id)
    result = await session.execute(stmt)
    row = result.first()
    
    if not row:
        raise HTTPException(status_code=500, detail="Failed to create page")

    page_id = row.id  # получаем ID

    # Создаём запись в kpi
    kpi_stmt = insert(kpi).values(page_id=page_id, counter=0, time_spent=0)
    await session.execute(kpi_stmt)

    await session.commit()

    return {"status": "created", "page_id": page_id, "title": page.title}



@router.get("/pages/{page_id}", response_model=Page)
async def get_page(page_id: int, session: AsyncSession = Depends(get_async_session)):
    # Увеличиваем счётчик
    stmt = update(kpi).where(kpi.c.page_id == page_id).values(counter=kpi.c.counter + 1)
    await session.execute(stmt)
    await session.commit()

    # Получаем саму страницу
    result = await session.execute(select(pages).where(pages.c.id == page_id))
    row = result.first()

    if not row:
        return Page(title="", content="")

    return Page(title=row.title, content=row.content)


@router.get("/kpis")
async def get_kpis(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(
        select(kpi.c.page_id, kpi.c.counter, kpi.c.time_spent, pages.c.title)
        .join(pages, kpi.c.page_id == pages.c.id)
    )
    rows = result.all()

    return [
        {
            "page_id": row.page_id,
            "title": row.title,
            "visits": row.counter,
            "time_spent_sec": row.time_spent,
            "time_spent": f"{row.time_spent // 60} мин {row.time_spent % 60} сек"
        }
        for row in rows
    ]


@router.post("/kpi/{page_id}/time")
async def add_time(
    page_id: int,
    seconds: int,
    session: AsyncSession = Depends(get_async_session)
):
    # Проверим, что страница существует
    # check = await session.execute(select(pages).where(pages.c.id == page_id))
    # if not check.first():
    #     raise HTTPException(status_code=404, detail="Page not found")

    stmt = update(kpi).where(kpi.c.page_id == page_id).values(
        time_spent=kpi.c.time_spent + seconds
    )
    await session.execute(stmt)
    await session.commit()

    return {"status": "success", "added_seconds": seconds}
