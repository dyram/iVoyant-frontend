import React, { useEffect, useState } from "react";
import {
  Table,
  Divider,
  Popconfirm,
  Button,
  Typography,
  Tag,
  Space,
} from "antd";
import { withRouter } from "react-router-dom";
import Axios from "axios";

import WrappedModal from "../ModalComp";
import WrappedPaymentModal from "../PaymentModal";

const { Title } = Typography;

export default function TableComp() {
  const [dataSource, setDataSource] = useState();
  const [vendors, setVendors] = useState([]);

  const paymentEnabled = true;
  const adjustEnabled = true;

  const [addFlag, setAddFlag] = useState(false);
  const [chosen, setChosen] = useState();

  const [payFlag, setPayFlag] = useState(false);
  const [payableAmount, setPayableAmount] = useState(0);
  const [creditUsed, setCreditUsed] = useState(adjustEnabled);

  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    // Axios.get(
    //   "https://cors-anywhere.herokuapp.com/https://s3-ap-southeast-1.amazonaws.com/he-public-data/sampledataa53d9c5.json"
    // ).then((res) => {
    //   if (res.status === 200) {
    //     console.log("DUMMY BACKEND : ", res.data);
    //   }
    // });

    Axios.get("http://localhost:4000/invoices").then((res) => {
      if (res.status === 200) {
        console.log("INVOICE", res.data);
        setDataSource([...res.data]);
      }
    });

    Axios.get("http://localhost:4000/vendors").then((res) => {
      if (res.status === 200) {
        console.log("VENDORS", res.data);
        setVendors([...res.data]);
      }
    });
  }, []);

  const columns = [
    {
      title: "Invoice ID",
      dataIndex: "invoiceId",
      key: "invoice",
    },
    {
      title: "Vendor ID",
      dataIndex: "vendorId",
      key: "vendor",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Balance",
      dataIndex: "amountBal",
      key: "balance",
    },
    {
      title: "Due",
      dataIndex: "amountDue",
      key: "due",
    },
    {
      title: "Date",
      dataIndex: "invoiceDate",
      key: "date",
    },
    {
      title: "Make Payment",
      render: (data) => (
        <div>
          {paymentEnabled ? (
            <Button
              onClick={(event) => {
                openModal(data, true);
                console.log(data);
              }}
              type="primary"
              disabled={data.amountDue === 0 ? true : false}
            >
              Pay
            </Button>
          ) : (
            <span>
              <Button disabled>Payment Disabled</Button>
            </span>
          )}
        </div>
      ),
    },
  ];

  const openModal = (data, flag) => {
    setSelected(data.vendorId);
    setAddFlag(flag);
    setChosen(data);
  };

  const openPay = (creditBool) => {
    setPayFlag(true);
    setCreditUsed(creditBool);
  };

  const applyCredit = (data) => {
    Axios.post("http://localhost:4000/credit/apply", data).then((res) => {
      if (res.status === 200) {
        console.log("CREDIT APPLY POST", res);
        setDataSource([...res.data.invoiceData]);
        setVendors([...res.data.vendors]);
        setPayableAmount(res.data.creditBal);

        if (res.data.creditBal === 0) {
          setAddFlag(false);
          setChosen(undefined);
        } else {
          setPayFlag(true);
        }
      }
    });
  };

  const payMoney = (data) => {
    Axios.post("http://localhost:4000/payment", data).then((res) => {
      if (res.status === 200) {
        console.log("PAYMENT POST", res);
        setDataSource([...res.data.invoiceData]);
        setVendors([...res.data.vendors]);
      }
    });
  };

  return (
    <div style={{ padding: "2%" }}>
      <Title style={{ width: "60%" }} level={4}>
        Invoices
      </Title>
      <Table dataSource={dataSource} columns={columns} />
      <WrappedModal
        vendorData={
          vendors[vendors.findIndex((obj) => obj.vendorId === selected)]
        }
        open={addFlag}
        close={() => {
          setAddFlag(false);
          //   setChosen(undefined);
        }}
        creditAllowed={adjustEnabled}
        emitData={(data) => {
          applyCredit(data);
        }}
        invoiceData={chosen}
        openPaymentModal={() => {
          setAddFlag(false);
          openPay(false);
        }}
      />
      <WrappedPaymentModal
        vendorData={
          vendors[vendors.findIndex((obj) => obj.vendorId === selected)]
        }
        open={payFlag}
        close={() => {
          setPayFlag(false);
          setChosen(undefined);
        }}
        creditAllowed={adjustEnabled}
        emitData={(data) => {
          payMoney(data);
        }}
        invoiceData={chosen}
        payAmount={payableAmount}
        creditUsed={creditUsed}
      />
    </div>
  );
}
