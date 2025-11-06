# Model podataka (v0)

Entiteti:

- Customer(id, name, email, phone)
- Vehicle(id, customer_id, make, model, vin, plate, year)
- Appointment(id, vehicle_id, mechanic_id?, starts_at timestamptz, status, note)
- WorkOrder(id, appointment_id, mechanic_id, description, status, total numeric(10,2))
- WorkItem(id, work_order_id, kind[service|part], title, qty, price numeric(10,2))
- LoanerCar(id, plate, available, note)
- LoanerReservation(id, loaner_car_id, appointment_id, status)
- User(id, email, oauth_provider, password_hash?, role)
- HandoverForm(id, appointment_id, direction[in|out], pdf_url, signed_by, created_at)

Indeksi: vehicle(vin), vehicle(plate), appointment(starts_at), work_order(status).

**ERD**: (privremeno) opis iznad; kasnije dodati dijagram slike `er-diagram.png`.
