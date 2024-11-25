const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post("/createOrderWithItems", async (req, res) => {
  const { table_id, status, items } = req.body;

  console.log("ข้อมูลที่ได้รับ:", { table_id, status, items });

  if (!table_id || !status || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ message: "ข้อมูลไม่ครบถ้วนหรือไม่มีรายการสินค้า" });
  }

  const client = await pool.connect(); // เริ่ม transaction
  try {
    await client.query("BEGIN");

    // 1. สร้าง order ใน OrderInfo
    const orderInfoQuery = `
        INSERT INTO OrderInfo (status, table_id)
        VALUES ($1, $2)
        RETURNING order_id
      `;
    const orderInfoResult = await client.query(orderInfoQuery, [
      status,
      table_id,
    ]);
    const orderId = orderInfoResult.rows[0].order_id;

    console.log("สร้าง OrderInfo สำเร็จ, order_id:", orderId);

    // 2. เพิ่มสินค้าใน Order_item
    const orderItemsQuery = `
        INSERT INTO Order_item (category_item_id, quantity, order_id)
        VALUES ($1, $2, $3)
      `;
    for (const item of items) {
      const { category_item_id, quantity } = item;
      if (!category_item_id || quantity <= 0) {
        throw new Error("ข้อมูลสินค้าไม่ถูกต้อง");
      }
      await client.query(orderItemsQuery, [
        category_item_id,
        quantity,
        orderId,
      ]);
    }

    await client.query("COMMIT"); // Commit transaction

    res.status(201).json({
      message: "สร้างออร์เดอร์พร้อมสินค้าเรียบร้อย",
      order_id: orderId,
    });
  } catch (err) {
    await client.query("ROLLBACK"); // Rollback transaction
    console.error("เกิดข้อผิดพลาด:", err.stack);
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการสร้างออร์เดอร์",
      error: err.message,
    });
  } finally {
    client.release();
  }
});

router.get('/get/:table_name', async (req, res) => {
    try {
      const { table_name } = req.params;
  
      if (!table_name) {
        return res.status(400).json({ error: 'Table name is required' });
      }
  
      const table = await pool.query(
        'SELECT table_id FROM tableinfo WHERE table_name = $1',
        [table_name]
      );
  
      if (table.rows.length === 0) {
        return res.status(404).json({ error: 'Table not found' });
      }
  
      res.status(200).json({ table_id: table.rows[0].table_id });
    } catch (error) {
      console.error('Error fetching table_id:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


module.exports = router;
