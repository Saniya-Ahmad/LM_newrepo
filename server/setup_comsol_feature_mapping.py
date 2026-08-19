import os
from dotenv import load_dotenv
import mysql.connector

load_dotenv()


def get_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
    )


def ensure_table(cursor):
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS comsol_feature_mapping (
            id INT AUTO_INCREMENT PRIMARY KEY,
            feature_name VARCHAR(150) NOT NULL,
            feature_display_name VARCHAR(150) NOT NULL,
            module_name VARCHAR(150) NOT NULL,
            module_quantity INT NOT NULL,
            UNIQUE KEY uniq_feature_name (feature_name)
        )
    """)


def populate(cursor):
    rows = [
        # ---- CONFIDENT 1:1 matches ----
        ("ACDC",                      "AC/DC",                        "AC/DC Module",                            5),
        ("RF",                        "RF",                           "RF Module",                               4),
        ("WAVEOPTICS",                "Wave Optics",                  "Wave Optics Module",                      4),
        ("RAYOPTICS",                 "Ray Optics",                   "Ray Optics Module",                       4),
        ("PLASMA",                    "Plasma",                       "Plasma Module",                           3),
        ("SEMICONDUCTOR",             "Semiconductor",                "Semiconductors Module",                   3),
        ("STRUCTURALMECHANICS",       "Structural Mechanics",         "Structural Mechanics Module",             5),
        ("NONLINEARSTRUCTMATERIALS",  "Nonlinear Structural Material","Nonlinear Structural Material Module",    5),
        ("MULTIBODYDYNAMICS",         "Multibody Dynamics",           "Multibody Dynamics Module",               3),
        ("MEMS",                      "MEMS",                         "MEMS Module",                             3),
        ("ACOUSTICS",                 "Acoustics",                    "Acoustics Module",                        4),
        ("CFD",                       "CFD",                          "CFD Module",                              4),
        ("PIPEFLOW",                  "Pipe Flow",                    "Pipe Flow Module",                        2),
        ("HEATTRANSFER",              "Heat Transfer",                "Heat Transfer Module",                    4),
        ("CORROSION",                 "Corrosion",                    "Corrosion Module",                        2),
        ("OPTIMIZATION",              "Optimization",                 "Optimization module",                     2),
        ("MATLIB",                    "Material Library",             "Material Library",                        2),
        ("DESIGN",                    "Design",                       "Design Module",                           1),

        # ---- MEDIUM confidence ----
        ("CHEM",                      "Chemical Reaction Engineering","Chemical Reaction Engineering Module",    1),

        # ---- NEEDS CONFIRMATION: the bracketed cluster from your photo ----
        # My read: CADIMPORT / CADIMPORTUSER are CAD-import-specific tokens
        # (matches the tick mark next to "ECAD Import Module" on your sheet).
        ("CADIMPORT",                 "CAD Import",                   "ECAD Import Module",                     1),
        ("CADIMPORTUSER",             "CAD Import (User)",            "ECAD Import Module",                     1),

        # My read: SERIAL / COMSOL / COMSOLGUI / COMSOLUSER are all base
        # engine access modes (interactive GUI vs. batch/serial), all
        # drawing from the core COMSOL Multiphysics pool of 16.
        ("SERIAL",                    "COMSOL (Serial/Batch)",        "COMSOL Multiphysics",                    16),
        ("COMSOL",                    "COMSOL (Core)",                "COMSOL Multiphysics",                    16),
        ("COMSOLGUI",                 "COMSOL (GUI)",                 "COMSOL Multiphysics",                    16),
        ("COMSOLUSER",                "COMSOL (User Session)",        "COMSOL Multiphysics",                    16),
    ]

    cursor.executemany(
        """
        INSERT INTO comsol_feature_mapping
            (feature_name, feature_display_name, module_name, module_quantity)
        VALUES (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            feature_display_name = VALUES(feature_display_name),
            module_name = VALUES(module_name),
            module_quantity = VALUES(module_quantity)
        """,
        rows,
    )


if __name__ == "__main__":
    conn = get_connection()
    cursor = conn.cursor()
    ensure_table(cursor)
    populate(cursor)
    conn.commit()
    print(f"comsol_feature_mapping ready with {cursor.rowcount} row(s) affected on this run.")
    cursor.close()
    conn.close()
