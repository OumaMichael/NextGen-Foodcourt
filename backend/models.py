from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.sql import func

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ('-orders.user', '-reservations.user', '-outlets.user', '-_password_hash')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)
    phone_no = db.Column(db.Integer)
    role = db.Column(db.String(20), nullable=False) # 'outlet owner' or 'customer'

    outlets = db.relationship('Outlet', back_populates='owner', cascade='all, delete-orphan')
    orders = db.relationship('Order', back_populates='user', cascade='all, delete-orphan')
    reservations = db.relationship('Reservation', back_populates='user', cascade='all, delete-orphan')

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hashes may not be viewed.")

    @password_hash.setter
    def password_hash(self, password):
        hashed_password = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')
        self._password_hash = hashed_password

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    @validates('name')
    def validate_name(self, key, name):
        existing = User.query.filter_by(name=name).first()
        if existing:
            raise ValueError("Username must be unique.")
        return name
    
    @validates('email')
    def validate_email(self, key, email):
        existing = User.query.filter_by(email=email).first()
        if existing:
            raise ValueError("Email must be unique.")
        return email
    
    def __repr__(self):
        return f"<Customer {self.name}, Email: {self.email}>"
    
class Cuisine(db.Model, SerializerMixin):
    __tablename__ = 'cuisines'
    serialize_rules = ('-outlets.cuisine',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    img_url = db.Column(db.String)

    outlets = db.relationship('Outlet', back_populates='cuisine', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f"<Cuisine {self.name}>"


class Outlet(db.Model, SerializerMixin):
    __tablename__ = 'outlets'
    serialize_rules = ('-cuisine.outlets', '-menu_items.outlet', '-owner.outlets')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    contact = db.Column(db.String)
    img_url = db.Column(db.String)
    cuisine_id = db.Column(db.Integer, db.ForeignKey('cuisines.id'))
    description = db.Column(db.String)

    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    owner = db.relationship('User', back_populates='outlets')
    cuisine = db.relationship('Cuisine', back_populates='outlets')
    menu_items = db.relationship('MenuItem', back_populates='outlet', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f"<Outlet {self.name}, Contact: {self.contact}>"

class MenuItem(db.Model, SerializerMixin):
    __tablename__ = 'menu_items'
    serialize_rules = ('-outlet.menu_items', '-order_items.menu_item',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    description = db.Column(db.String)
    price = db.Column(db.Integer)
    category = db.Column(db.String)
    outlet_id = db.Column(db.Integer, db.ForeignKey('outlets.id'))

    outlet = db.relationship('Outlet', back_populates='menu_items')
    order_items = db.relationship('OrderItem', back_populates='menu_item', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f"<MenuItem {self.name}, Price: {self.price}, Category: {self.category}>"

class Order(db.Model, SerializerMixin):
    __tablename__ = 'orders'
    serialize_rules = ('-user.orders', '-order_items.order', '-reservation.order',)

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String, nullable=False)
    total_price = db.Column(db.Float, nullable=False, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    user = db.relationship('User', back_populates='orders')
    order_items = db.relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')
    reservation = db.relationship('Reservation', back_populates='order', uselist=False)
    
    @property
    def user_summary(self):
        return {
            "id": self.user.id,
            "name": self.user.name,
            "email": self.user.email,
            "phone_no": self.user.phone_no,
            "role": self.user.role
        }

    def __repr__(self):
        return f"<Order ID: {self.id}, Status: {self.status}, Total: {self.total_price}>"

class OrderItem(db.Model, SerializerMixin):
    __tablename__ = 'order_items'
    serialize_rules = ('-order.order_items', '-menu_item.order_items',)

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    sub_total = db.Column(db.Float)
    quantity = db.Column(db.Integer)
    menuitem_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'))

    order = db.relationship('Order', back_populates='order_items')
    menu_item = db.relationship('MenuItem', back_populates='order_items')
    
    def __repr__(self):
        return f"<OrderItem ID: {self.id}, Qty: {self.quantity}, Subtotal: {self.sub_total}>"

class Table(db.Model, SerializerMixin):
    __tablename__ = 'tables'
    serialize_rules = ('-reservations.table',)

    id = db.Column(db.Integer, primary_key=True)
    table_number = db.Column(db.Integer, unique=True, nullable=False)
    capacity = db.Column(db.Integer)
    is_available = db.Column(db.String)

    reservations = db.relationship('Reservation', back_populates='table', cascade='all, delete-orphan')
    
    def __repr__(self):
        return f"<Table #{self.table_number}, Available: {self.is_available}>"

class Reservation(db.Model, SerializerMixin):
    __tablename__ = 'reservations'
    serialize_rules = ('-user.reservations', '-order.reservation', '-table.reservations',)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'))
    table_id = db.Column(db.Integer, db.ForeignKey('tables.id'))
    booking_date = db.Column(db.Date, nullable=False)  
    booking_time = db.Column(db.Time, nullable=False)  
    no_of_people = db.Column(db.Integer)
    status = db.Column(db.String)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    user = db.relationship('User', back_populates='reservations')
    order = db.relationship('Order', back_populates='reservation')
    table = db.relationship('Table', back_populates='reservations')
    
    @property
    def user_summary(self):
        if self.user:
            return {
                "id": self.user.id,
                "name": self.user.name,
                "email": self.user.email
            }
        return None

        
    @property
    def table_summary(self):
        return {
            "id": self.table.id,
            "table_number": self.table.table_number,
            "capacity": self.table.capacity,
            "is_available": self.table.is_available
        }


    def __repr__(self):
        return f"<Reservation ID: {self.id}, Table: {self.table_id}, Status: {self.status}>"
