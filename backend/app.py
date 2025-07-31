#!/usr/bin/env python3

from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask import request, jsonify
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity,  get_jwt
from datetime import datetime, time


from config import app, db, api, jwt, jwt_blacklist
from models import User, Cuisine, Outlet, MenuItem, Table, Order, OrderItem, Reservation

@app.route('/')
def home():
    return "<h1>Welcome to NextGen Food Court APIs</h1>"

@app.route('/health')
def health():
    return {"status": "healthy", "message": "Backend is running"}
     
# ------------------ AUTH ------------------ #
class Register(Resource):
    def post(self):
        data = request.get_json()
        try:
            user = User(
                name=data['name'],
                email=data['email'],
                phone_no=data['phone_no'],
                role=data['role']
            )
            user.password_hash = data['password']
            db.session.add(user)
            db.session.commit()
            return user.to_dict(rules=('-orders', '-reservations', '-outlets')), 201
        except IntegrityError:
            db.session.rollback()
            return {"message": "User already exists"}, 400

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        if user and user.authenticate(data['password']):
            access_token = create_access_token(identity={'id': user.id, 'role': user.role})
            return {"access_token": access_token, "user": user.to_dict(rules=('-orders', '-reservations', '-outlets'))}, 200
        return {"message": "Invalid credentials"}, 401
    
class Logout(Resource):
    @jwt_required()
    def post(self):
        jti = get_jwt()["jti"] 
        jwt_blacklist.add(jti)
        return {"message": "Successfully logged out"}, 200

class CheckAuth(Resource):
    @jwt_required()
    def get(self):
        user_identity = get_jwt_identity()
        return {"message": "Authenticated", "user": user_identity}, 200

# ------------------ USERS ------------------ #
class UserLists(Resource):
    @jwt_required()
    def get(self):
        return [user.to_dict(rules=('-orders', '-reservations', '-outlets')) for user in User.query.all()]

class UserDetails(Resource):
    @jwt_required()
    def get(self, id):
        user = User.query.get(id)
        return user.to_dict(rules=('-orders', '-reservations', '-outlets'))

    @jwt_required()
    def patch(self, id):
        data = request.get_json()
        user = User.query.get(id)
        
        if not user:
            return {"error": "User not found."}, 404
        
        if 'name' in data:
            user.name = data['name']
        if 'email' in data:
            user.email = data['email']
        if 'phone_no' in data:
            user.phone_no = data['phone_no']
            
        db.session.commit()
        return user.to_dict(rules=('-orders', '-reservations', '-outlets')) 
    
    @jwt_required()
    def delete(self, id):
       user = User.query.get(id)
       db.session.delete(user)
       db.session.commit()
       return {"message": "User deleted Successfully"}

# ------------------ CUISINES ------------------ #
class CuisineList(Resource):
    def get(self):
        return [cuisine.to_dict(rules=('-outlets',)) for cuisine in Cuisine.query.all()]
    
    def post(self):
        data = request.get_json()
        cuisine = Cuisine(name=data['name'])
        db.session.add(cuisine)
        db.session.commit()
        return cuisine.to_dict(rules=('-outlets',)), 201
    
class CuisineDetails(Resource):
    def get(self, id):
        return Cuisine.query.get(id).to_dict(rules=('-outlets',))

    def patch(self, id):
        data = request.get_json()
        cuisine = Cuisine.query.get(id)
        
        if not cuisine:
            return {"error": "Cuisine not found."}, 404
        
        if 'name' in data:
            cuisine.name = data['name']
        db.session.commit()
        return cuisine.to_dict(rules=('-outlets',))
            
    def delete(self, id):
        cuisine = Cuisine.query.get(id)
        db.session.delete(cuisine)
        db.session.commit()
        return {"message": "Cuisine deleted successfully"}

# ------------------ OUTLETS ------------------ #
class OutletLists(Resource):
    def get(self):
        outlets = Outlet.query.all()
        return [outlet.to_dict(rules=( '-menu_items', '-owner',)) for outlet in outlets]   

    def post(self):
       data = request.get_json()
       try:
           outlet = Outlet(
               name=data['name'],
               contact=data['contact'],
               img_url=data['img_url'],
               description=data['description'],
               cuisine_id=data['cuisine_id'],
               owner_id=data['owner_id']
           )
           db.session.add(outlet)
           db.session.commit()
           return outlet.to_dict(rules=('-cuisine', '-menu_items', '-owner',)), 201
       except IntegrityError:
           db.session.rollback()
           return {"message": "Outlet already exists or invalid data"}, 400

class OutletDetails(Resource):
    def get(self, id):
        outlet = Outlet.query.get(id)
        if not outlet:
            return {"error": "Outlet not found."}, 404
        return outlet.to_dict(rules=('-cuisine', '-menu_items', '-owner'))

    def patch(self, id):
       outlet = Outlet.query.get(id)
       if not outlet:
           return {"error": "Outlet not found."}, 404
       data = request.get_json()
       if 'name' in data:
           outlet.name = data['name']
       if 'contact' in data:
           outlet.contact = data['contact']
       if 'img_url' in data:
            outlet.img_url = data['img_url']
       if 'description' in data:
           outlet.description = data['description']
       if 'cuisine_id' in data:
           outlet.cuisine_id = data['cuisine_id']
       if 'owner_id' in data:
           outlet.owner_id = data['owner_id']
       db.session.commit()
       return outlet.to_dict(rules=('-cuisine.outlets', '-menu_items.outlet', '-owner.outlets'))

    def delete(self, id):
       outlet = Outlet.query.get(id)
       if not outlet:
           return {"error": "Outlet not found."}, 404
       db.session.delete(outlet)
       db.session.commit()
       return {"message": "Outlet deleted successfully"}

# ------------------ MENU ITEMS ------------------ #
class MenuItemLists(Resource):
    def get(self):
        outlet_id = request.args.get('outlet_id')
        if outlet_id:
            items = MenuItem.query.filter_by(outlet_id=outlet_id).all()
        else:
            items = MenuItem.query.all()
        return [item.to_dict(rules=( '-order_items',)) for item in items]

    def post(self):
        data = request.get_json()
        try:
            item = MenuItem(
                name=data['name'],
                description=data['description'],
                price=data['price'],
                category=data['category'],
                outlet_id=data['outlet_id']
            )
            db.session.add(item)
            db.session.commit()
            return item.to_dict(rules=('-outlet', '-order_items')), 201
        except IntegrityError:
            db.session.rollback()
            return {"message": "Menu item already exists or invalid data"}, 400

class MenuItemDetails(Resource):
    def get(self, id):
        item = MenuItem.query.get(id)
        if not item:
            return {"error": "Menu item not found."}, 404
        return item.to_dict(rules=('-outlet', '-order_items',))
    
    def patch(self, id):
        item = MenuItem.query.get(id)
        if not item:
            return {"error": "Menu item not found."}, 404
        data = request.get_json()
        if 'name' in data:
            item.name = data['name']
        if 'description' in data:
            item.description = data['description']
        if 'price' in data:
            item.price = data['price']
        if 'category' in data:
            item.category = data['category']
        if 'outlet_id' in data:
            item.outlet_id = data['outlet_id']
        db.session.commit()
        return item.to_dict(rules=('-outlet', '-order_items',))
    
    def delete(self, id):
        item = MenuItem.query.get(id)
        if not item:
            return {"error": "Menu item not found."}, 404
        db.session.delete(item)
        db.session.commit()
        return {"message": "Menu item deleted successfully"}

# ------------------ ORDERS ------------------ #
class OrderLists(Resource):
    def get(self):
        orders = Order.query.all()
        return [
            {
                **order.to_dict(rules=('-reservation', '-user')),  
                "user": order.user_summary                         
            }
            for order in orders
        ]


    def post(self):
        data = request.get_json()
        try:
            order = Order(
                user_id=data['user_id'],
                total_price=data['total_price'],
                status=data.get('status', 'pending')
            )
            db.session.add(order)
            db.session.commit()
            return order.to_dict(rules=('-reservation', '-order_items', '-user-',)), 201
        except IntegrityError:
            db.session.rollback()
            return {"message": "Order already exists or invalid data"}, 400

class OrderDetails(Resource):
    def get(self, id):
        order = Order.query.get(id)
        if not order:
            return {"error": "Order not found."}, 404
        return order.to_dict(rules=('-reservation', '-order_items','-user-',))
    
    def patch(self, id):
        order = Order.query.get(id)
        if not order:
            return {"error": "Order not found."}, 404
        data = request.get_json()
        if 'status' in data:
            order.status = data['status']
        if 'total_price' in data:
            order.total_price = data['total_price']
        db.session.commit()
        return order.to_dict(rules=('-reservation', '-order_items', '-user-',))

    def delete(self, id):
        order = Order.query.get(id)
        if not order:
            return {"error": "Order not found."}, 404
        db.session.delete(order)
        db.session.commit()
        return {"message": "Order deleted successfully"}

# ------------------ ORDER ITEMS ------------------ #
class OrderItemLists(Resource):
    def get(self):
        order_items = OrderItem.query.all()
        return [
            order_item.to_dict(rules=('-order', '-menu_item')) 
            for order_item in order_items
        ]

    def post(self):
        data = request.get_json()
        try:
            order_item = OrderItem(
                order_id=data['order_id'],
                menuitem_id=data['menuitem_id'],
                quantity=data.get('quantity', 1),
                sub_total=data.get('sub_total')
            )
            db.session.add(order_item)
            db.session.commit()
            return order_item.to_dict(rules=('-order', '-menu_item')), 201
        except IntegrityError:
            db.session.rollback()
            return {"message": "Invalid order item data"}, 400

class OrderItemDetails(Resource):
    def get(self, id):
        order_item = OrderItem.query.get(id)
        if not order_item:
            return {"error": "Order item not found."}, 404
        return order_item.to_dict(rules=('-order', '-menu_item'))

    def patch(self, id):
        order_item = OrderItem.query.get(id)
        if not order_item:
            return {"error": "Order item not found."}, 404
        
        data = request.get_json()
        if 'quantity' in data:
            order_item.quantity = data['quantity']
        if 'subtotal' in data:
            order_item.subtotal = data['subtotal']
        
        db.session.commit()
        return order_item.to_dict(rules=('-order.order_items', '-menu_item.order_items'))

    def delete(self, id):
        order_item = OrderItem.query.get(id)
        if not order_item:
            return {"error": "Order item not found."}, 404
        
        db.session.delete(order_item)
        db.session.commit()
        return {"message": "Order item deleted successfully"}

# ------------------ TABLES ------------------ #
class TableLists(Resource):
    def get(self):
        tables = Table.query.all()
        return [
            table.to_dict(rules=('-outlet', '-reservations')) 
            for table in tables
        ]

    def post(self):
        data = request.get_json()
        try:
            table = Table(
                outlet_id=data['outlet_id'],
                table_number=data['table_number'],
                capacity=data['capacity'],
                status=data.get('status', 'available')
            )
            db.session.add(table)
            db.session.commit()
            return table.to_dict(rules=('-outlet.tables', '-reservations')), 201
        except IntegrityError:
            db.session.rollback()
            return {"message": "Table creation failed"}, 400

class TableDetails(Resource):
    def get(self, id):
        table = Table.query.get(id)
        if not table:
            return {"error": "Table not found."}, 404
        return table.to_dict(rules=('-outlet', '-reservations'))

    def patch(self, id):
        table = Table.query.get(id)
        if not table:
            return {"error": "Table not found."}, 404
        
        data = request.get_json()
        if 'table_number' in data:
            table.table_number = data['table_number']
        if 'capacity' in data:
            table.capacity = data['capacity']
        if 'status' in data:
            table.status = data['status']
        if 'outlet_id' in data:
            table.outlet_id = data['outlet_id']
        
        db.session.commit()
        return table.to_dict(rules=('-outlet.tables', '-reservations'))

    def delete(self, id):
        table = Table.query.get(id)
        if not table:
            return {"error": "Table not found."}, 404
        
        db.session.delete(table)
        db.session.commit()
        return {"message": "Table deleted successfully"}

# ------------------ RESERVATIONS ------------------ #
class ReservationLists(Resource):
    
    def get(self):
        reservations = Reservation.query.all()
        return [
            {
                **res.to_dict(rules=('-user', '-table', '-order')),
                "user": res.user_summary,
                "table": res.table_summary,
            }
            for res in reservations
        ]

    def post(self):
        data = request.get_json()
        try:
            table = Table.query.get(data['table_id'])
            if not table:
                return {"error": "Table not found"}, 404
            if table.is_available != 'Yes':
                return {"error": "Table is not available"}, 400

            reservation = Reservation(
                user_id=data['user_id'],
                table_id=data['table_id'],
                booking_date=datetime.strptime(data['booking_date'], "%Y-%m-%d").date(),
                booking_time=datetime.strptime(data['booking_time'], "%H:%M:%S").time(),
                status=data.get('status', 'Confirmed'),
                no_of_people=data.get('no_of_people', 1),
                order_id=data.get('order_id')
            )
            db.session.add(reservation)
            table.is_available = 'No'
            db.session.commit()
            return reservation.to_dict(rules=('-user', '-table', '-order')), 201
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

class ReservationDetails(Resource):
    def get(self, id):
        reservation = Reservation.query.get(id)
        if not reservation:
            return {"error": "Reservation not found."}, 404
        return reservation.to_dict(rules=('-user', '-table', '-order'))

    def patch(self, id):
        data = request.get_json()
        reservation = Reservation.query.get(id)
        if not reservation:
            return {"error": "Reservation not found"}, 404
        try:
            if 'user_id' in data:
                reservation.user_id = data['user_id']
            if 'table_id' in data and data['table_id'] != reservation.table_id:
                new_table = Table.query.get(data['table_id'])
                if not new_table:
                    return {"error": "New table not found"}, 404
                if new_table.is_available != 'Yes':
                    return {"error": "New table is not available"}, 400
                old_table = Table.query.get(reservation.table_id)
                if old_table:
                    old_table.is_available = 'Yes'
                reservation.table_id = new_table.id
                new_table.is_available = 'No'
            if 'booking_date' in data:
                reservation.booking_date = datetime.strptime(data['booking_date'], "%Y-%m-%d").date()
            if 'booking_time' in data:
                reservation.booking_time = datetime.strptime(data['booking_time'], "%H:%M:%S").time()
            if 'status' in data:
                reservation.status = data['status']
            if 'no_of_people' in data:
                reservation.no_of_people = data['no_of_people']
            db.session.commit()
            return reservation.to_dict(rules=('-user', '-table', '-order')), 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

    def delete(self, id):
        reservation = Reservation.query.get(id)
        if not reservation:
            return {"error": "Reservation not found"}, 404
        try:
            table = reservation.table
            db.session.delete(reservation)
            if table:
                table.is_available = 'Yes'
            db.session.commit()
            return {"message": "Reservation deleted successfully"}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500

# ------------------ ROUTES ------------------ #
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(CheckAuth, '/check-auth')

api.add_resource(UserLists, '/users')
api.add_resource(UserDetails, '/users/<int:id>')

api.add_resource(CuisineList, '/cuisines')
api.add_resource(CuisineDetails, '/cuisines/<int:id>')

api.add_resource(OutletLists, '/outlets')
api.add_resource(OutletDetails, '/outlets/<int:id>')

api.add_resource(MenuItemLists, '/menu-items')
api.add_resource(MenuItemDetails, '/menu-items/<int:id>')

api.add_resource(OrderLists, '/orders')
api.add_resource(OrderDetails, '/orders/<int:id>')

api.add_resource(OrderItemLists, '/order-items')
api.add_resource(OrderItemDetails, '/order-items/<int:id>')

api.add_resource(TableLists, '/tables')
api.add_resource(TableDetails, '/tables/<int:id>')

api.add_resource(ReservationLists, '/reservations')
api.add_resource(ReservationDetails, '/reservations/<int:id>')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5555, debug=False)
