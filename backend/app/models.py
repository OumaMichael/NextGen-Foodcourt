
class Cuisine(db.Model):
    __tablename__ = 'cuisines'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)

    outlets = db.relationship('Outlet', backref='cuisine', lazy=True)

class Outlet(db.Model):
    __tablename__ = 'outlets'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact = db.Column(db.String(100), nullable=False)
    cuisine_id = db.Column(db.Integer, db.ForeignKey('cuisines.id'), nullable=False)

    menu_items = db.relationship('MenuItem', backref='outlet', lazy=True)

class MenuItem(db.Model):
    __tablename__ = 'menu_items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    price = db.Column(db.Float, nullable=False)
    outlet_id = db.Column(db.Integer, db.ForeignKey('outlets.id'), nullable=False)

    order_items = db.relationship('OrderItem', backref='menu_item', lazy=True)

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='Pending')

    order_items = db.relationship('OrderItem', backref='order', lazy=True)
    reservations = db.relationship('Reservation', backref='order', lazy=True)

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    menu_item_id = db.Column(db.Integer, db.ForeignKey('menu_items.id'), nullable=False)
    subtotal = db.Column(db.Float, nullable=False)

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    phone_no = db.Column(db.String(15), nullable=False)

    reservations = db.relationship('Reservation', backref='customer', lazy=True)

class Reservation(db.Model):
    __tablename__ = 'reservations'
    
    id = db.Column(db.Integer, primary_key=True)
    booking_time = db.Column(db.DateTime, nullable=False)
    number_of_people = db.Column(db.Integer, nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    table_id = db.Column(db.Integer, db.ForeignKey('tables.id'), nullable=False) 
    status = db.Column(db.String(50), default='Booked')

    outlet_id = db.Column(db.Integer, db.ForeignKey('outlets.id'), nullable=False)
    outlet = db.relationship('Outlet', backref='reservations', lazy=True)

class Table(db.Model):
    __tablename__ = 'tables'
    
    id = db.Column(db.Integer, primary_key=True)
    table_no = db.Column(db.String(50), nullable=False)
    is_available = db.Column(db.String(10), default='Yes')

    reservations = db.relationship('Reservation', backref='table', lazy=True)