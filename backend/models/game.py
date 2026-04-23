from sqlalchemy import Column, String, Integer, DateTime, Text
from sqlalchemy.sql import func
from core.database import Base


class GameModel(Base):
    __tablename__ = "games"
    
    id = Column(String, primary_key=True)
    state = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class CardModel(Base):
    __tablename__ = "cards"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    card_type = Column(String, nullable=False)
    rarity = Column(String, nullable=False)
    cost = Column(Integer, nullable=False)
    damage = Column(Integer, nullable=True)
    block = Column(Integer, nullable=True)
    effects = Column(Text, nullable=True)