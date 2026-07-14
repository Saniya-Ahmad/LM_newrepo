from datetime import datetime
import mysql.connector

# ==========================
# DATABASE CONNECTION
# ==========================

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="saniya_2306139",
    database="license_analytics"
)

cursor = conn.cursor()

# ==========================
# CREATE TABLE
# ==========================

cursor.execute("""
CREATE TABLE IF NOT EXISTS matlab_license_log (

    id INT AUTO_INCREMENT PRIMARY KEY,

    event_date DATE,

    event_time TIME,

    event_type VARCHAR(20),

    feature VARCHAR(100),

    username VARCHAR(100),

    hostname VARCHAR(100),

    pid INT

)
""")

conn.commit()

# ==========================
# LOG FILE
# ==========================

filename = "../logs/MATLAB.log"

current_date = None

# ==========================
# READ FILE
# ==========================

with open(filename, "r", encoding="utf-8") as file:

    for line in file:

        line = line.strip()

        if not line:
            continue

        

        if "(MLM) TIMESTAMP" in line:

            try:
                date_string = line.split("TIMESTAMP",1)[1].strip()
                current_date = datetime.strptime(
                    date_string,
                    "%m/%d/%Y"
                ).date()
            except:
                pass

            continue

        

        if ' OUT: "' in line:
            continue

        if ' IN: "' in line:
            continue

      

        if "(MLM) CHECKOUT:" in line:

            event_type = "CHECKOUT"

        elif "(MLM) CHECKIN:" in line:

            event_type = "CHECKIN"

        elif "(MLM) DENIED:" in line:

            event_type = "DENIED"

        else:
            continue

     

        event_time = line.split()[0]

        feature = ""
        username = ""
        hostname = ""
        pid = None

       

        if event_type == "DENIED":

            try:

                first_quote = line.find('"')
                second_quote = line.find('"', first_quote + 1)

                feature = line[first_quote+1:second_quote]

                remaining = line[second_quote+1:].strip()

                if "@" in remaining:

                    username, hostname = remaining.split("@",1)

            except:
                pass

        

        else:

            if event_type == "CHECKOUT":

                data = line.split("CHECKOUT:",1)[1]

            else:

                data = line.split("CHECKIN:",1)[1]

            details = {}

            fields = data.split(",")

            for field in fields:

                field = field.strip()

                field = field.strip("[]")

                if "=" not in field:
                    continue

                key,value = field.split("=",1)

                details[key.lower()] = value

            feature = details.get("feature","")

            username = details.get("user","")

            hostname = details.get("host","")

            pid = details.get("pid")

            if pid:

                try:
                    pid = int(pid)
                except:
                    pid = None

            if "date" in details:

                try:

                    current_date = datetime.strptime(
                        details["date"],
                        "%d-%b-%Y"
                    ).date()

                except:
                    pass

       

        cursor.execute("""

        INSERT INTO matlab_license_log(

            event_date,

            event_time,

            event_type,

            feature,

            username,

            hostname,

            pid

        )

        VALUES(%s,%s,%s,%s,%s,%s,%s)

        """,

        (

            current_date,

            event_time,

            event_type,

            feature,

            username,

            hostname,

            pid

        ))
conn.commit()
cursor.close()
conn.close()
print("MATLAB log parsed successfully.")