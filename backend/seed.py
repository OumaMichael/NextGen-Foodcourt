from app import app, db
from models import User, Cuisine, Outlet, MenuItem, Table, Order, OrderItem, Reservation
from datetime import datetime, timedelta

def seed_data():
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
        
        italian = Cuisine(name="Italian", img_url="https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400")
        chinese = Cuisine(name="Chinese", img_url="https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400")
        indian = Cuisine(name="Indian", img_url="https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400")
        mexican = Cuisine(name="Mexican", img_url="https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400")
        coastal = Cuisine(name="Coastal", img_url="https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400")
        fast_food = Cuisine(name="Fast Food", img_url="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400")
        vegan = Cuisine(name="Vegan", img_url="https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400")
        bbq = Cuisine(name="BBQ", img_url="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400")
        japanese = Cuisine(name="Japanese", img_url="https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400")

        
        db.session.add_all([italian, chinese, indian, mexican, coastal, fast_food, vegan, bbq, japanese])

        outlet1 = Outlet(name="Pasta Palace", contact="0700111222", cuisine=italian, owner=owner1, img_url="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400", description="Authentic Italian pasta dishes served fresh daily with handmade sauces and ingredients.")
        outlet2 = Outlet(name="Dragon Express", contact="0700333444", cuisine=chinese, owner=owner2, img_url="https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400", description="Fast and flavorful Chinese takeout featuring noodles, dumplings, and stir-fries." )
        outlet3 = Outlet(name="Curry Hut", contact="0700555666", cuisine=indian, owner=owner3, img_url="https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400", description="A warm hut of aromatic Indian curries, tandoori specialties, and buttery naan.")
        outlet4 = Outlet(name="Taco Town", contact="0700777888", cuisine=mexican, owner=owner4, img_url='https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400',  description="A vibrant stop for street-style tacos, burritos, and sizzling fajitas." )
        outlet5 = Outlet(name="Tamu Tamu Grills", contact="0700999000", cuisine=bbq, owner=owner1, img_url="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400", description="Juicy grilled meats and flavorful BBQ delights with a Kenyan twist.")
        outlet6 = Outlet(name="Swahili Plates", contact="0700888111", cuisine=coastal, owner=owner2, img_url="https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400", description="Tasty coastal dishes rich with spices, coconut, and Swahili tradition.")
        outlet7 = Outlet(name="Burger Bros", contact="0700777222", cuisine=fast_food, owner=owner3, img_url="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400", description="Smash burgers, loaded fries, and thick milkshakes served fast and fresh.")
        outlet8 = Outlet(name="Sushi Spot", contact="0700666333", cuisine=japanese, owner=owner4, img_url="https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400",  description="Fresh sushi rolls, sashimi, and Japanese delicacies crafted with precision.")
        outlet9 = Outlet(name="Spice Garden", contact="0700555444", cuisine=indian, owner=owner1, img_url="https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400", description="A garden of bold Indian spices offering rich curries and vegetarian favorites.")
        outlet10 = Outlet(name="Green Bowl", contact="0700444333", cuisine=vegan, owner=owner2, img_url="https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400",  description="Nutritious vegan bowls packed with greens, grains, and guilt-free goodness.")

        db.session.add_all([outlet1, outlet2, outlet3, outlet4, outlet5, outlet6, outlet7, outlet8, outlet9, outlet10])

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
            MenuItem(name="Grilled Chicken", description="Marinated chicken with traditional spices", price=1200, category="Main", outlet=outlet5),
            MenuItem(name="Beef Kebabs", description="Tender beef skewers", price=1500, category="Main", outlet=outlet5),
            MenuItem(name="Grilled Fish", description="Fresh fish with herbs", price=1800, category="Main", outlet=outlet5),
            MenuItem(name="Chicken Biryani", description="Fragrant rice with spiced chicken", price=1000, category="Main", outlet=outlet6),
            MenuItem(name="Coconut Rice", description="Rice cooked in coconut milk", price=600, category="Side", outlet=outlet6),
            MenuItem(name="Fish Curry", description="Coconut fish curry", price=1400, category="Main", outlet=outlet6),
            MenuItem(name="Classic Burger", description="Beef patty with lettuce and tomato", price=800, category="Main", outlet=outlet7),
            MenuItem(name="Chicken Burger", description="Grilled chicken breast burger", price=750, category="Main", outlet=outlet7),
            MenuItem(name="Fries", description="Crispy golden fries", price=400, category="Side", outlet=outlet7),
            MenuItem(name="California Roll", description="Avocado and crab roll", price=1200, category="Main", outlet=outlet8),
            MenuItem(name="Salmon Nigiri", description="Fresh salmon over rice", price=1500, category="Main", outlet=outlet8),
            MenuItem(name="Miso Soup", description="Traditional soybean soup", price=500, category="Starter", outlet=outlet8),
            MenuItem(name="Butter Chicken", description="Creamy tomato chicken curry", price=1300, category="Main", outlet=outlet9),
            MenuItem(name="Dal Curry", description="Lentil curry with spices", price=700, category="Main", outlet=outlet9),
            MenuItem(name="Buddha Bowl", description="Mixed vegetables and quinoa", price=900, category="Main", outlet=outlet10),
            MenuItem(name="Green Smoothie", description="Spinach, banana, and mango", price=500, category="Drink", outlet=outlet10),
            MenuItem(name="Veggie Wrap", description="Fresh vegetables in a tortilla", price=700, category="Main", outlet=outlet10),
            ]
        db.session.add_all(items)

        tables = [
            Table(table_number=1, capacity='5', is_available="Yes"),
            Table(table_number=2, capacity='6', is_available="No"),
            Table(table_number=3, capacity='4', is_available="Yes"),
            Table(table_number=4, capacity='3', is_available="Yes"),
            Table(table_number=5, capacity='5', is_available="Yes"),
            Table(table_number=6, capacity='6', is_available="Yes"),
            Table(table_number=7, capacity='3', is_available="Yes"),
            Table(table_number=8, capacity='4', is_available="Yes"),
            Table(table_number=9, capacity='5', is_available="Yes"),
            Table(table_number=10, capacity='4', is_available="Yes")
        ]
        db.session.add_all(tables)

        now = datetime.now()
        reservation_datetime1 = now + timedelta(minutes=25)
        reservation_datetime2 = now + timedelta(minutes=25)

        order1 = Order(status="pending", total_price=950, user=customer1)
        order_item1 = OrderItem(order=order1, menu_item=items[1], quantity=1, sub_total=950)
        reservation1 = Reservation(
            user=customer1,
            order=order1,
            table=tables[0],
            booking_date=reservation_datetime1.date(),  
            booking_time=reservation_datetime1.time(),  
            no_of_people=2,
            status="cancelled"
        )

        order2 = Order(status="confirmed", total_price=1200, user=customer2)
        order_item2 = OrderItem(order=order2, menu_item=items[3], quantity=2, sub_total=1200)
        reservation2 = Reservation(
        user=customer2,
        order=order2,
        table=tables[1],
        booking_date=reservation_datetime2.date(), 
        booking_time=reservation_datetime2.time(),  
        no_of_people=3,
        status="confirmed"
        )

        db.session.add_all([order1, order_item1, reservation1, order2, order_item2, reservation2])
        db.session.commit()

        print("Seed data added successfully.")

if __name__ == "__main__":
    seed_data()
