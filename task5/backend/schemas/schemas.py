from pydantic import BaseModel

class Page(BaseModel):
    title: str = ""
    content: str = ""

class Kpi(BaseModel):
    page_id: int = 0
    counter: int = 0
    time_spent: int = 0
