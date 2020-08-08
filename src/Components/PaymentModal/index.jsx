import React, { useState, useEffect } from "react";
import { Modal, Input, Form, Row, Col, Radio, Typography, message } from "antd";
import Axios from "axios";
import { formatTimeStr } from "antd/lib/statistic/utils";

const { Item } = Form;

const { Text, Title } = Typography;

const ModalTwo = ({
  form,
  open,
  close,
  vendorData,
  creditAllowed,
  emitData,
  invoiceData,
  payAmount,
  creditUsed,
}) => {
  const { getFieldDecorator } = form;

  const [vendorChosen, setVendorChosen] = useState();
  const [adjustEnabled, setAdjustEnabled] = useState();

  const [creditAmount, setCreditAmount] = useState(0);

  useEffect(() => {
    setCreditAmount(payAmount);
    console.log("PAY AMOUNT : ", payAmount);
    form.setFieldsValue({ amount: payAmount });
  }, [payAmount, open]);

  useEffect(() => {
    console.log("VENDOR SELECT", vendorData);
    setVendorChosen(vendorData);
  }, [vendorData]);

  useEffect(() => {
    console.log("CHOSEN SELECT", invoiceData);
    // setVendorChosen(vendorData);
  }, [invoiceData]);

  useEffect(() => {
    console.log("CREDIT ALLOWED", creditAllowed);
    setAdjustEnabled(creditAllowed);
  }, [creditAllowed]);

  const handleSubmit = () => {
    form.validateFields((validationError) => {
      if (validationError === null) {
        const payAmount = form.getFieldValue("amount");

        console.log("PAYMNET EMIT: ", {
          payAmount,
          creditUsed,
          vendor: vendorChosen,
          invoice: invoiceData,
        });

        emitData({
          payAmount,
          creditUsed,
          vendor: vendorChosen,
          invoice: invoiceData,
        });

        clearFieldsAndClose();
      }
    });
  };

  const clearFieldsAndClose = () => {
    form.resetFields();
    setCreditAmount(0);
    close();
  };

  return (
    <Modal
      title={<Title level={4}>Payment Details</Title>}
      visible={open}
      onCancel={clearFieldsAndClose}
      okText="Pay Amount"
      onOk={() => handleSubmit()}
    >
      <Form>
        <Row type="flex" justify="space-between">
          {/* <Col span={10}>
          </Col> */}
          <Col span={20}>
            <Item required label={<Text>Payable Amount</Text>} colon={false}>
              {getFieldDecorator("amount")(
                <Input
                  disabled={true}
                  type="number"
                  addonBefore="&#8377;"
                  value={creditAmount}
                />
              )}
            </Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

const WrappedPaymentModal = Form.create({ name: "normal_login" })(ModalTwo);

export default WrappedPaymentModal;
