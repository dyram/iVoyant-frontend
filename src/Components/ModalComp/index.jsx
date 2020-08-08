import React, { useState, useEffect } from "react";
import { Modal, Input, Form, Row, Col, Radio, Typography, message } from "antd";
import Axios from "axios";

const { Item } = Form;

const { Text, Title } = Typography;

const ModalOne = ({
  form,
  open,
  close,
  vendorData,
  creditAllowed,
  emitData,
  invoiceData,
  openPaymentModal,
}) => {
  const { getFieldDecorator } = form;

  const [vendorChosen, setVendorChosen] = useState();
  const [adjustEnabled, setAdjustEnabled] = useState();

  const [changeCredit, setChangeCredit] = useState(true);

  useEffect(() => {
    console.log("VENDOR SELECT", vendorData);
    setVendorChosen(vendorData);
  }, [vendorData]);

  useEffect(() => {
    console.log("CREDIT ALLOWED", creditAllowed);
    setAdjustEnabled(creditAllowed);
  }, [creditAllowed]);

  const handleSubmit = () => {
    form.validateFields((validationError) => {
      if (validationError === null) {
        const creditApplied = form.getFieldValue("credit");
        const creditAmount = form.getFieldValue("amount");

        console.log({
          creditApplied,
          creditAmount: parseInt(creditAmount),
          vendor: vendorChosen,
        });

        emitData({
          creditApplied,
          creditAmount,
          vendor: vendorChosen,
          invoice: invoiceData,
        });

        clearFieldsAndClose();
      }
    });
  };

  const clearFieldsAndClose = () => {
    form.resetFields();
    setChangeCredit(true);
    close();
  };

  const changeCreditRadio = (e) => {
    console.log("radio checked", e.target.value);
    setChangeCredit(e.target.value);
  };

  return (
    <Modal
      title={<Title level={4}>Use Store Credit</Title>}
      visible={open}
      onCancel={clearFieldsAndClose}
      okText={changeCredit ? "Apply Credit" : "Pay Dues"}
      onOk={() => {
        changeCredit ? handleSubmit() : openPaymentModal(invoiceData);
      }}
    >
      <Form>
        <Row type="flex" justify="space-between">
          <Col span={10}>
            <Item
              required
              label={<Text>Apply Store Credit? </Text>}
              colon={false}
            >
              {getFieldDecorator("credit", {
                rules: [{ required: true, message: "Select an option" }],
              })(
                <Radio.Group
                  onChange={(e) => {
                    changeCreditRadio(e);
                  }}
                  value={changeCredit}
                >
                  <Radio value={true}>Yes</Radio>
                  <Radio value={false}>No</Radio>
                </Radio.Group>
              )}
            </Item>
          </Col>
          <Col span={10}>
            <Item required label={<Text>Credit Amount</Text>} colon={false}>
              {getFieldDecorator("amount", {
                rules: [{ required: true, message: "Enter Credit Amount" }],
              })(
                <Input
                  disabled={changeCredit ? false : true}
                  type="number"
                  addonBefore="&#8377;"
                  placeholder="Enter Credit Amount"
                />
              )}
            </Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

const WrappedModal = Form.create({ name: "normal_login" })(ModalOne);

export default WrappedModal;
