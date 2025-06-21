import { EditOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormTextArea,
  ProFormSelect,
  ProFormSwitch,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Modal, Card, Switch, Space } from 'antd';
import React, { useRef, useState } from 'react';

type DisplayItem = {
  id: string;
  name: string;
  fieldKey: string;
  fieldName: string;
  displayOrder: number;
  isVisible: boolean;
  displayFormat: string;
  description: string;
  createTime: string;
};

const DisplayManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [settingModalOpen, setSettingModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<DisplayItem>();
  const actionRef = useRef<ActionType>();

  // 模拟数据
  const mockData: DisplayItem[] = [
    {
      id: '1',
      name: '产品名称显示',
      fieldKey: 'productName',
      fieldName: '产品名称',
      displayOrder: 1,
      isVisible: true,
      displayFormat: 'text',
      description: '显示产品的名称信息',
      createTime: '2023-12-01 10:00:00',
    },
    {
      id: '2',
      name: '生产状态显示',
      fieldKey: 'productionStatus',
      fieldName: '生产状态',
      displayOrder: 2,
      isVisible: true,
      displayFormat: 'badge',
      description: '显示当前生产状态',
      createTime: '2023-12-01 10:00:00',
    },
    {
      id: '3',
      name: '生产时间显示',
      fieldKey: 'productionTime',
      fieldName: '生产时间',
      displayOrder: 3,
      isVisible: false,
      displayFormat: 'datetime',
      description: '显示生产开始时间',
      createTime: '2023-12-01 10:00:00',
    },
  ];

  const handleToggleVisible = (record: DisplayItem) => {
    message.success(`${record.isVisible ? '隐藏' : '显示'}成功`);
    actionRef.current?.reload();
  };

  const handleEditInfo = (record: DisplayItem) => {
    setCurrentRow(record);
    handleUpdateModalOpen(true);
  };

  const handleDisplaySetting = () => {
    setSettingModalOpen(true);
  };

  const columns: ProColumns<DisplayItem>[] = [
    {
      title: '显示项名称',
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a onClick={() => handleEditInfo(entity)}>
            {dom}
          </a>
        );
      },
    },
    {
      title: '字段标识',
      dataIndex: 'fieldKey',
    },
    {
      title: '字段名称',
      dataIndex: 'fieldName',
    },
    {
      title: '显示顺序',
      dataIndex: 'displayOrder',
      sorter: true,
    },
    {
      title: '显示格式',
      dataIndex: 'displayFormat',
      valueEnum: {
        text: { text: '文本', status: 'Default' },
        badge: { text: '徽章', status: 'Processing' },
        datetime: { text: '日期时间', status: 'Success' },
        number: { text: '数字', status: 'Warning' },
      },
    },
    {
      title: '是否显示',
      dataIndex: 'isVisible',
      render: (_, record) => (
        <Switch
          checked={record.isVisible}
          onChange={() => handleToggleVisible(record)}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => handleEditInfo(record)}
        >
          <EditOutlined /> 编辑信息
        </a>,
        <Popconfirm
          key="delete"
          title="确定删除这个显示项吗？"
          onConfirm={() => {
            message.success('删除成功');
            actionRef.current?.reload();
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<DisplayItem>
        headerTitle="展示信息管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="setting"
            onClick={handleDisplaySetting}
          >
            <SettingOutlined /> 生产信息展示项设定
          </Button>,
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建显示项
          </Button>,
        ]}
        request={async () => {
          return {
            data: mockData,
            success: true,
            total: mockData.length,
          };
        }}
        columns={columns}
      />
      
      <ModalForm
        title="新建显示项"
        width="500px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={async (value) => {
          message.success('提交成功');
          handleModalOpen(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '显示项名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="显示项名称"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '字段标识为必填项',
            },
          ]}
          width="md"
          name="fieldKey"
          label="字段标识"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '字段名称为必填项',
            },
          ]}
          width="md"
          name="fieldName"
          label="字段名称"
        />
        <ProFormText
          width="md"
          name="displayOrder"
          label="显示顺序"
        />
        <ProFormSelect
          width="md"
          name="displayFormat"
          label="显示格式"
          options={[
            { label: '文本', value: 'text' },
            { label: '徽章', value: 'badge' },
            { label: '日期时间', value: 'datetime' },
            { label: '数字', value: 'number' },
          ]}
        />
        <ProFormSwitch
          name="isVisible"
          label="是否显示"
        />
        <ProFormTextArea
          width="md"
          name="description"
          label="描述"
        />
      </ModalForm>
      
      <ModalForm
        title="编辑显示项"
        width="500px"
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        initialValues={currentRow}
        onFinish={async (value) => {
          message.success('更新成功');
          handleUpdateModalOpen(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '显示项名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="显示项名称"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '字段标识为必填项',
            },
          ]}
          width="md"
          name="fieldKey"
          label="字段标识"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '字段名称为必填项',
            },
          ]}
          width="md"
          name="fieldName"
          label="字段名称"
        />
        <ProFormText
          width="md"
          name="displayOrder"
          label="显示顺序"
        />
        <ProFormSelect
          width="md"
          name="displayFormat"
          label="显示格式"
          options={[
            { label: '文本', value: 'text' },
            { label: '徽章', value: 'badge' },
            { label: '日期时间', value: 'datetime' },
            { label: '数字', value: 'number' },
          ]}
        />
        <ProFormSwitch
          name="isVisible"
          label="是否显示"
        />
        <ProFormTextArea
          width="md"
          name="description"
          label="描述"
        />
      </ModalForm>

      <Modal
        title="生产信息展示项设定"
        open={settingModalOpen}
        onCancel={() => setSettingModalOpen(false)}
        footer={[
          <Button key="save" type="primary" onClick={() => {
            message.success('保存成功');
            setSettingModalOpen(false);
          }}>
            保存设置
          </Button>,
          <Button key="close" onClick={() => setSettingModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        <div style={{ padding: '16px 0' }}>
          <Card title="显示项配置" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              {mockData.map((item) => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 12px',
                  border: '1px solid #f0f0f0',
                  borderRadius: '4px'
                }}>
                  <div>
                    <strong>{item.fieldName}</strong>
                    <span style={{ marginLeft: '8px', color: '#666' }}>({item.fieldKey})</span>
                  </div>
                  <div>
                    <span style={{ marginRight: '8px' }}>顺序: {item.displayOrder}</span>
                    <Switch
                      checked={item.isVisible}
                      onChange={() => handleToggleVisible(item)}
                    />
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default DisplayManagement;