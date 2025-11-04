from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from PIL import Image, ImageOps
import io
import requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Разрешаем запросы с React (http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Эндпоинт: проксируем посты из JSONPlaceholder
@app.get("/posts")
async def get_posts():
    response = requests.get("https://jsonplaceholder.typicode.com/posts")
    return response.json()

# Эндпоинт: инвертируем изображение
@app.post("/invert-image")
async def invert_image(file: UploadFile = File(...)):
    image = Image.open(file.file)
    if image.mode != "RGB":
        image = image.convert("RGB")
    inverted = ImageOps.invert(image)

    buf = io.BytesIO()
    inverted.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")
