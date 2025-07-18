from app import app  
from config import db
from models import User, Cuisine, Outlet, MenuItem, Table, Order, OrderItem, Reservation
from datetime import datetime, timedelta

with app.app_context():
    print("Seeding database...")

    db.drop_all()
    db.create_all()

    customer1 = User(name="Alice", email="alice@example.com", phone_no=712345678, role="customer")
    customer1.password_hash = "password123"

    customer2 = User(name="Bob", email="bob@example.com", phone_no=722345678, role="customer")
    customer2.password_hash = "password123"

    owner1 = User(name="Diana", email="diana@pasta.com", phone_no=740000001, role="owner")
    owner1.password_hash = "ownerpass1"

    owner2 = User(name="Eli", email="eli@dragon.com", phone_no=740000002, role="owner")
    owner2.password_hash = "ownerpass2"

    owner3 = User(name="Fiona", email="fiona@curryhut.com", phone_no=740000003, role="owner")
    owner3.password_hash = "ownerpass3"

    owner4 = User(name="George", email="george@tacotown.com", phone_no=740000004, role="owner")
    owner4.password_hash = "ownerpass4"

    db.session.add_all([customer1, customer2, owner1, owner2, owner3, owner4])

    italian = Cuisine(name="Italian")
    chinese = Cuisine(name="Chinese")
    indian = Cuisine(name="Indian")
    mexican = Cuisine(name="Mexican")
    db.session.add_all([italian, chinese, indian, mexican])

    outlet1 = Outlet(name="Pasta Palace", contact="0700111222", cuisine=italian, owner=owner1)
    outlet2 = Outlet(name="Dragon Express", contact="0700333444", cuisine=chinese, owner=owner2)
    outlet3 = Outlet(name="Curry Hut", contact="0700555666", cuisine=indian, owner=owner3)
    outlet4 = Outlet(name="Taco Town", contact="0700777888", cuisine=mexican, owner=owner4)
    db.session.add_all([outlet1, outlet2, outlet3, outlet4])

    items = [
        MenuItem(name="Spaghetti", description="Classic spaghetti with tomato sauce", price=800, category="Main", outlet=outlet1),
        MenuItem(name="Lasagna", description="Layered pasta with cheese and meat", price=950, category="Main", outlet=outlet1),
        MenuItem(name="Bruschetta", description="Grilled bread with tomato", price=450, category="Starter", outlet=outlet1),
        MenuItem(name="Fried Rice", description="Fried rice with vegetables", price=600, category="Main", outlet=outlet2),
        MenuItem(name="Sweet and Sour Chicken", description="Chicken with tangy sauce", price=700, category="Main", outlet=outlet2),
        MenuItem(name="Spring Rolls", description="Crispy rolls with vegetables", price=400, category="Starter", outlet=outlet2),
        MenuItem(name="Chicken Tikka", description="Spiced grilled chicken", price=850, category="Main", outlet=outlet3),
        MenuItem(name="Naan Bread", description="Soft Indian flatbread", price=150, category="Side", outlet=outlet3),
        MenuItem(name="Paneer Butter Masala", description="Cheese in creamy tomato sauce", price=800, category="Main", outlet=outlet3),
        MenuItem(name="Beef Taco", description="Soft taco with seasoned beef", price=300, category="Main", outlet=outlet4),
        MenuItem(name="Quesadilla", description="Grilled cheese tortilla", price=500, category="Main", outlet=outlet4),
        MenuItem(name="Nachos", description="Corn chips with melted cheese", price=450, category="Snack", outlet=outlet4),
    ]
    db.session.add_all(items)

    tables = [
        Table(table_number=1, is_available="Yes"),
        Table(table_number=2, is_available="Yes"),
        Table(table_number=3, is_available="Yes"),
        Table(table_number=4, is_available="No")
    ]
    db.session.add_all(tables)

    order1 = Order(status="Pending", total_price=950, user=customer1)
    order_item1 = OrderItem(order=order1, menu_item=items[1], quantity=1, sub_total=950)
    reservation1 = Reservation(
        user=customer1,
        order=order1,
        table=tables[0],
        booking_time=datetime.now() + timedelta(minutes=25),
        no_of_people=2,
        status="Confirmed"
    )

    order2 = Order(status="Confirmed", total_price=1200, user=customer2)
    order_item2 = OrderItem(order=order2, menu_item=items[3], quantity=2, sub_total=1200)
    reservation2 = Reservation(
        user=customer2,
        order=order2,
        table=tables[1],
        booking_time=datetime.now() + timedelta(minutes=25),
        no_of_people=3,
        status="Confirmed"
    )

    db.session.add_all([order1, order_item1, reservation1, order2, order_item2, reservation2])
    db.session.commit()

    print("Seed data added successfully.")