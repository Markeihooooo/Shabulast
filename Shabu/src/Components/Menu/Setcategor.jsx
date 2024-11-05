import React from 'react';
import { Button, Section, Table, Text, Switch, IconButton } from "@radix-ui/themes";
import { MdEdit } from "react-icons/md";

const Setcategor = () => {
  return (
    <div className="p-4 rounded-lg  w-full text-2xl">


      {/* header */}
      <Section width="650px" className="mb-4 p-4 bg-rose-100 text-center rounded-2xl">
        <Text
          className="text-black p-2 text-center font-bold text-5xl"
          style={{
            textShadow: '2px 2px 1 red, -1px -1px 0 red, 1px -1px 0 red, -1px 1px 0 red',
            lineHeight: '1.0ป', // เพิ่มความสูงของเส้น
            letterSpacing: '0.05em' // เพิ่มระยะห่างระหว่างตัวอักษร
          }}
        >
          จัดการหมวดหมู่อาหาร
        </Text>


      </Section>


      {/* body */}
      <Section className="p-2 justify-center">
        <Text className=" text-black p-2 text-center">
          จำนวนรายการหมวดหมู่ทั้งหมด :
        </Text>
        <Table.Root className="w-full text-center justify-center">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell className="border border-gray-300 w-1/12 p-4">ลำดับ</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border border-gray-300  p-4">ชื่อหมวดหมู่อาหาร</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border border-gray-300 w-1/12 p-4">แก้ไข</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="border border-gray-300 w-2/12 p-4">สถานะการใช้งาน</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row className="hover:bg-gray-100 transition-all">
              <Table.RowHeaderCell className="border border-gray-300 p-4">1</Table.RowHeaderCell>
              <Table.Cell className="border border-gray-300 p-4 text-left">danilo@example.com</Table.Cell>

              <Table.Cell className="border border-gray-300 p-4">
                <Button className=" text-black p-2 hover:bg-gray-100 hover:text-blue-500 ">
                  <MdEdit fontSize={32} ></MdEdit>
                </Button>
              </Table.Cell>

              <Table.Cell className="border border-gray-300 p-4">
                {/* <Switch color="orange" defaultChecked className="w-8 h-4" /> */}

              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>


        {/* ปุ่มเพิ่มรายการอยู่ตรงกลาง */}
        <div className="flex justify-center m-5 w-1/2 mx-auto">
          <Button className="bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition-colors">เพิ่มรายการหมวดหมู่อาหาร</Button>
        </div>
      </Section>


      {/* footer */}
      <Section className="flex justify-end space-x-4 mt-6">
        <Button className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-colors w-24">ยกเลิก</Button>
        <Button className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors w-24">บันทึก</Button>
      </Section>
    </div>
  );
};

export default Setcategor;
