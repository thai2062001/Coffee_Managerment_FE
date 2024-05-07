import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { path } from "../../ultils/constant";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import HeaderLayout from "./HeaderLayout";
import AddStaffForm from "./FormLayout/AddStaffForm";
import {
  showSuccessNotification,
  showFailureNotification,
} from "../../ultils/notificationUtils";
import EditForm from "./FormLayout/EditForm";
import StaffTable from "./TableLayout/StaffTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaffData } from "../../store/Slice/staffSlice";
import { callAPINoHead, callAPIDelete } from "../../ultils/axiosApi";
const { Header, Content, Footer, Sider } = Layout;
const items2 = [
  {
    key: "sub1",
    icon: React.createElement(UserOutlined),
    label: "Manage Storage and tools",
    children: [
      { key: "1", label: "Storage" },
      { key: "2", label: "tools" },
    ],
  },
  {
    key: "sub2",
    icon: React.createElement(LaptopOutlined),
    label: "Manage drinks and menus ",
    children: [
      { key: "5", label: "Drink" },
      { key: "6", label: "Menu" },
    ],
  },
  {
    key: "sub3",
    icon: React.createElement(NotificationOutlined),
    label: "Manage permissions and employees",
    children: [
      { key: "9", label: "Employees" },
      { key: "10", label: "Permission" },
    ],
  },
  {
    key: "sub4",
    icon: React.createElement(NotificationOutlined),
    label: "Bill management",
    children: [
      { key: "11", label: "Bill" },
      { key: "12", label: "Statistical" },
    ],
  },
];
const Staff = () => {
  const [selectedKeys, setSelectedKeys] = useState(["9"]);
  const [dataSource, setDataSource] = useState();
  const dispatch = useDispatch();
  const staffList = useSelector((state) => state.staff.staffList);

  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    dispatch(fetchStaffData());
  }, [dispatch]);

  useEffect(() => {
    setDataSource(staffList);
  }, [staffList]);

  useEffect(() => {
    if (selectedKeys[0] === "9") {
      return;
    } else if (selectedKeys[0] === "2") {
      navigate(path.CONTENT2);
    } else if (selectedKeys[0] === "1") {
      navigate(path.CONTENT1);
    } else if (selectedKeys[0] === "5") {
      navigate(path.DRINK);
    } else if (selectedKeys[0] === "10") {
      navigate(path.ROLE);
    }
  }, [selectedKeys, navigate]);

  const handleAdd = (data) => {
    // Kiểm tra xem formData có dữ liệu không
    if (
      Object.values(data).some(
        (value) => value !== "" && value !== null && value !== undefined
      )
    ) {
      setDataSource([...dataSource, data]);
    } else {
      console.log("Vui lòng điền đầy đủ thông tin trước khi thêm.");
    }
  };

  const handleEdit = (drink_id) => {};

  const handleDelete = async (itemId) => {
    console.log(itemId);
    try {
      await callAPIDelete(`http://localhost:5000/staff/${itemId}`);
      console.log("Staff Item deleted successfully!");
      const newData = dataSource.filter((item) => item.staff_id !== itemId);
      setDataSource(newData);
      showSuccessNotification("Thông báo", "Đã xóa thành công");
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.staff.id);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const handleMenuClick = (e) => {
    const key = e.key;
    setSelectedKeys([key]);
  };
  return (
    <Layout>
      <HeaderLayout />
      <Content
        style={{
          padding: "0 48px",
        }}
      >
        <Breadcrumb
          style={{
            margin: "16px 0",
          }}
        >
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Layout
          style={{
            padding: "24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Sider
            style={{
              background: colorBgContainer,
            }}
            width={200}
          >
            <Menu
              onClick={handleMenuClick}
              mode="inline"
              selectedKeys={selectedKeys}
              defaultOpenKeys={["sub1"]}
              style={{
                height: "100%",
              }}
              items={items2}
            />
          </Sider>
          <Content
            style={{
              padding: "0 24px",
              minHeight: 280,
            }}
          >
            <div className="flex justify-center p-1 ">
              <span className="text-[28px] font-bold ">Quản lý kho</span>
            </div>
            <div className="w-1800 flex flex-col justify-start  mt-3">
              <div className="w-200">
                <AddStaffForm onAddData={handleAdd} />
              </div>
            </div>
            <StaffTable
              dataSource={dataSource}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onSave={handleSave}
              onEdit={handleEdit}
            />
          </Content>
        </Layout>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      ></Footer>
    </Layout>
  );
};
export default Staff;
