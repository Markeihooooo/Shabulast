const bcrypt = require("bcrypt");
const pool = require("./db"); // การเชื่อมต่อฐานข้อมูลจากไฟล์ db.js

async function seed() {
  try {
    console.log("Seeding database...");

    // ล้างข้อมูลก่อน เพื่อป้องกันข้อผิดพลาดจากข้อมูลซ้ำ
    await pool.query(
      "TRUNCATE TABLE Order_item, Bill, TableInfo, OrderInfo, Category_item, Category, Employee RESTART IDENTITY CASCADE"
    );

    // เข้ารหัสรหัสผ่าน
    const passwordHash = await bcrypt.hash("123456", 10);

    // เพิ่มข้อมูลใน Employee
    await pool.query(
      `
      INSERT INTO Employee (username, password, phone_number, role) 
      VALUES 
      ('kanun', $1, '0812345678', 'เจ้าของ'),
      ('employee1', $1, '0823456789', 'พนักงาน'),
      ('chef1', $1, '0834567890', 'คนทำอาหาร')
    `,
      [passwordHash]
    );

    // เพิ่มข้อมูลใน Category
    await pool.query(`
      INSERT INTO Category (category_name, is_active, create_by) 
      VALUES 
      ('อาหาร', TRUE, 1),
      ('เครื่องดื่ม', TRUE, 1),
      ('ของหวาน', TRUE, 1)
    `);

    // เพิ่มข้อมูลใน Category_item
    await pool.query(`
      INSERT INTO Category_item (category_item_name, category_item_balance, image_url, category_id, create_by) 
      VALUES 
    ('ชาบูหมู', 10, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQk1kOu9ImvHdtmcZZZjE6S8aNrtoERHDvKQ&s', 1, 1),
    ('น้ำเปล่า', 50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbVy5dGMi0H83xBFe7xYftBvcvEVslLTy0bQ&s', 2, 1),
    ('ไอศกรีม', 20, 'https://www.hfocus.org/sites/default/files/u11/shutterstock_13847400822.jpg', 3, 1)
    `);

  
    // เพิ่มข้อมูลใน OrderInfo
await pool.query(`
    INSERT INTO OrderInfo (status, create_at)
    VALUES 
    ('กำลังดำเนินการ', NOW()),
    ('เสร็จสิ้น', NOW())
  `);
  

    // เพิ่มข้อมูลใน TableInfo
    await pool.query(`
      INSERT INTO TableInfo (table_id, order_id, table_name)  
      VALUES 
      (gen_random_uuid(), 1,1),
      (gen_random_uuid(), 2,2),
      (gen_random_uuid(), 1,3),
      (gen_random_uuid(), 2,4)
    `);

    // เพิ่มข้อมูลใน Bill
    await pool.query(`
      INSERT INTO Bill (customer_count, table_id, payment_status, create_by) 
      VALUES 
      (4, (SELECT table_id FROM TableInfo LIMIT 1), FALSE, 1),
      (2, (SELECT table_id FROM TableInfo OFFSET 1 LIMIT 1), FALSE, 1)
    `);

    console.log("Seeding completed successfully!");
    process.exit(0); // ออกจากกระบวนการเมื่อเสร็จสมบูรณ์
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1); // ออกจากกระบวนการเมื่อเกิดข้อผิดพลาด
  }
}

seed();
