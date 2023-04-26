""".

.
"""
from .database import *
from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, Body
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

import json

# создаем таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI()

# определяем зависимость


async def get_db():
    """.

    .
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/api/users")
async def get_people(db: Session = Depends(get_db)):
    """.

    .
    """
    return db.query(Person).all()


@app.get("/api/users/{id}")
async def get_person(id, db: Session = Depends(get_db)):
    """.

    .
    """
    # получаем пользователя по id
    person = db.query(Person).filter(Person.id == id).first()
    # если не найден, отправляем статусный код и сообщение об ошибке
    if person == None:
        return JSONResponse(status_code=404, content={"message": "Пользователь не найден"})
    #если пользователь найден, отправляем его
    return person


@app.post("/api/users")
async def create_person(data=Body(), db: Session = Depends(get_db)):
    """.

    .
    """
    person = Person(name=data["name"], age=data["age"], languages=json.dumps(data["languages"]), company=data["company"])
    db.add(person)
    db.commit()
    db.refresh(person)
    return person


@app.put("/api/users")
async def edit_person(data=Body(), db: Session = Depends(get_db)):
    """.

    .
    """
    # получаем пользователя по id
    person = db.query(Person).filter(Person.id == data["id"]).first()
    # если не найден, отправляем статусный код и сообщение об ошибке
    if person == None:
        return JSONResponse(status_code=404, content={"message": "Пользователь не найден"})
    # если пользователь найден, изменяем его данные и отправляем обратно клиенту
    person.age = data["age"]
    person.name = data["name"]
    person.languages = json.dumps(data["languages"])
    person.company = data["company"]
    db.commit()  # сохраняем изменения
    db.refresh(person)
    return person


@app.delete("/api/users/{id}")
async def delete_person(id, db: Session = Depends(get_db)):
    """.

    .
    """
    # получаем пользователя по id
    person = db.query(Person).filter(Person.id == id).first()

    # если не найден, отправляем статусный код и сообщение об ошибке
    if person == None:
        return JSONResponse(status_code=404, content={"message": "Пользователь не найден"})

    # если пользователь найден, удаляем его
    db.delete(person)  # удаляем объект
    db.commit()     # сохраняем изменения
    return person


app.mount("/", StaticFiles(directory="public", html=True))
