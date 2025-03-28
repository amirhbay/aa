from passlib.hash import bcrypt

password = 'admin'
hashed_password = bcrypt.hash(password)
print(hashed_password)