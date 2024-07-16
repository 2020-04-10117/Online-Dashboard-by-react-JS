import serial
import pymysql
import time

# Configure serial port (adjust the port to match your setup)
serial_port = 'COM9'  # Change to the correct port for COM9 on Windows
baud_rate = 9600

# Configure MySQL connection
db_host = 'localhost'
db_user = 'root'
db_password = ''  # Add your MySQL password if required
db_name = 'arduino_data'
table_name = 'sensor_data'

# Establish serial connection
try:
    ser = serial.Serial(serial_port, baud_rate)
    print(f"Opened serial port {serial_port}")
except serial.SerialException as e:
    print(f"Could not open serial port {serial_port}: {e}")
    exit(1)

# Establish MySQL connection
try:
    connection = pymysql.connect(host=db_host, user=db_user, password=db_password, database=db_name)
    cursor = connection.cursor()
    print("Connected to MySQL database")
except pymysql.MySQLError as e:
    print(f"Could not connect to MySQL database: {e}")
    ser.close()
    exit(1)

# SQL query to insert data
insert_query = f"INSERT INTO {table_name} (tds, temperature, light, ph) VALUES (%s, %s, %s, %s)"

try:
    while True:
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').strip()
            print(f"Received: {line}")
            
            try:
                # Parse the data
                data = line.split(',')
                if len(data) != 4:
                    raise ValueError(f"Incorrect data format: {data}")

                tds = float(data[0].split(':')[1].strip())
                temp = float(data[1].split(':')[1].strip())
                light = int(data[2].split(':')[1].strip())
                ph = float(data[3].split(':')[1].strip())

                # Insert data into MySQL database
                cursor.execute(insert_query, (tds, temp, light, ph))
                connection.commit()
                
                print(f"Inserted: TDS={tds}, TEMP={temp}, LIGHT={light}, PH={ph}")

            except (ValueError, IndexError) as e:
                print(f"Error parsing data: {e}")

        time.sleep(1)

except KeyboardInterrupt:
    print("Program terminated by user.")

finally:
    ser.close()
    cursor.close()
    connection.close()
    print("Closed serial and MySQL connections")







