from pydantic import BaseModel

class Page(BaseModel):
    title: str = ""
    content: str = ""

class Kpi(BaseModel):
    page_id: int
    counter: int
    time_spent: int
