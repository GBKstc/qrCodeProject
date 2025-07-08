import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormSelect,
  ProTable,
  ProFormDateTimePicker,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, QRCode, Modal, Table, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import { getProductionInfoList, ProductionInfoItem } from '@/services/production/productionInfo';
import { request } from '@umijs/max';

// 展示模块接口类型
interface ShowModuleItem {
  id: number;
  code: string;
  name: string;
  isShow: number;
  createTime: string;
  updateTime: string;
  operateId: number;
  operateName: string;
  remark: string;
}

const DisplayManagement: React.FC = () => {
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showSettingModalOpen, setShowSettingModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ProductionInfoItem>();
  const [showModuleList, setShowModuleList] = useState<ShowModuleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  // 获取展示模块列表
  const getShowModuleList = async () => {
    setLoading(true);
    try {
      const response = await request('/api/daciProduceShow/pageList', {
        method: 'POST',
        data: {
          currPage: 1,
          pageSize: 999, // 获取全部
        },
      });
      
      if (response.success) {
        setShowModuleList(response.data?.records || []);
      } else {
        message.error(response.message || '获取展示模块失败');
      }
    } catch (error) {
      message.error('网络请求失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 更新展示状态
  const updateShowStatus = async (record: ShowModuleItem, isShow: boolean) => {
    try {
      const response = await request('/api/daciProduceShow/saveOrUpdate', {
        method: 'POST',
        data: {
          id: record.id,
          code: record.code,
          name: record.name,
          isShow: isShow ? 1 : 0,
          remark: record.remark,
        },
      });
      
      if (response.success) {
        message.success('更新成功');
        // 更新本地状态
        setShowModuleList(prev => 
          prev.map(item => 
            item.id === record.id 
              ? { ...item, isShow: isShow ? 1 : 0 }
              : item
          )
        );
      } else {
        message.error(response.message || '更新失败');
      }
    } catch (error) {
      message.error('网络请求失败，请重试');
    }
  };

  // 打开展示设定模态窗口
  const handleShowSetting = () => {
    setShowSettingModalOpen(true);
    getShowModuleList();
  };

  // 编辑功能
  const handleUpdate = async (values: any) => {
    try {
      const response = await request('/api/daciProduce/saveOrUpdate', {
        method: 'POST',
        data: {
          id: currentRow?.id,
          shareBatchCode: values.shareBatchCode,
          shareProductTime: values.shareProductTime,
        },
      });
      
      if (response.success) {
        message.success('更新成功');
        handleUpdateModalOpen(false);
        setCurrentRow(undefined);
        actionRef.current?.reload();
        return true;
      } else {
        message.error(response.message || '更新失败');
        return false;
      }
    } catch (error) {
      message.error('更新失败，请重试');
      return false;
    }
  };

  // 删除功能
  const handleDelete = async (record: ProductionInfoItem) => {
    try {
      const response = await request('/api/daciProduce/saveOrUpdate', {
        method: 'POST',
        data: {
          id: record.id,
          del: 1,
        },
      });
      
      if (response.success) {
        message.success('删除成功');
        actionRef.current?.reload();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  // 编辑按钮点击
  const handleEdit = (record: ProductionInfoItem) => {
    setCurrentRow(record);
    handleUpdateModalOpen(true);
  };

  // 展示模块表格列定义
  const showModuleColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '模块编码',
      dataIndex: 'code',
      width: 120,
    },
    {
      title: '模块名称',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '是否展示',
      dataIndex: 'isShow',
      width: 100,
      render: (value: number, record: ShowModuleItem) => (
        <Switch
          checked={value === 1}
          onChange={(checked) => updateShowStatus(record, checked)}
        />
      ),
    },
    // {
    //   title: '操作人员',
    //   dataIndex: 'operateName',
    //   width: 100,
    // },
    // {
    //   title: '更新时间',
    //   dataIndex: 'updateTime',
    //   width: 160,
    // },
    // {
    //   title: '备注',
    //   dataIndex: 'remark',
    //   width: 200,
    //   ellipsis: true,
    // },
  ];

  const columns: ProColumns<ProductionInfoItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 60,
      fixed: 'left',
      search: false,
    },
    {
      title: '二维码',
      dataIndex: 'qrcodeUrl',
      width: 100,
      search: false,
      render: (_, record) => (
        <QRCode
          value={record.qrcodeUrl}
          size={50}
        />
      ),
    },
    {
      title: '二维码编号',
      dataIndex: 'qrcodeId',
      width: 120,
      ellipsis: true,
    },
    {
      title: '型号',
      dataIndex: 'size',
      width: 120,
      ellipsis: true,
    },
    {
      title: '图号',
      dataIndex: 'thumbCode',
      width: 120,
      ellipsis: true,
    },
    {
      title: '商标',
      dataIndex: 'trademark',
      width: 120,
      ellipsis: true,
    },
    {
      title: '生产时间',
      dataIndex: 'produceTime',
      valueType: 'dateTime',
      width: 160,
      search: false,
    },
    {
      title: '展示生产时间',
      dataIndex: 'shareProductTime',
      valueType: 'dateTime',
      width: 160,
      search: false,
    },
    {
      title: '批次编号',
      dataIndex: 'batchCode',
      width: 120,
      ellipsis: true,
    },
    {
      title: '展示批次编号',
      dataIndex: 'shareBatchCode',
      width: 120,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 160,
      fixed: 'right',
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>,
        <Popconfirm
          key="delete"
          title="确定删除这条记录吗？"
          onConfirm={() => handleDelete(record)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
          >
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<ProductionInfoItem>
        headerTitle="展示信息管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        scroll={{ x: 1400 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={handleShowSetting}
          >
            展示设定
          </Button>,
        ]}
        request={async (params) => {
          try {
            const response = await getProductionInfoList({
              currPage: params.current,
              pageSize: params.pageSize,
              qrcodeId: params.qrcodeId,
              size: params.size,
              thumbCode: params.thumbCode,
              trademark: params.trademark,
              batchCode: params.batchCode,
              shareBatchCode: params.shareBatchCode,
            });
            
            if (response.success) {
              return {
                data: response.data?.records || [],
                success: true,
                total: response.data?.total || 0,
              };
            } else {
              message.error(response.message || '获取数据失败');
              return {
                data: [],
                success: false,
                total: 0,
              };
            }
          } catch (error) {
            message.error('网络请求失败，请重试');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
      />
      
      {/* 展示设定Modal */}
      <Modal
        title="展示设定"
        open={showSettingModalOpen}
        onCancel={() => setShowSettingModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowSettingModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width={800}
        destroyOnClose
      >
        <Table
          columns={showModuleColumns}
          dataSource={showModuleList}
          rowKey="id"
          loading={loading}
          pagination={false}
          size="small"
          scroll={{ y: 400 }}
        />
      </Modal>
      
      {/* 编辑Modal */}
      <ModalForm
        title="编辑展示信息"
        width="600px"
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        initialValues={currentRow}
        onFinish={handleUpdate}
        key={currentRow?.id}
      >
        {/* 只读字段展示 */}
        <ProFormText
          width="md"
          name="size"
          label="型号"
          readonly
        />
        <ProFormText
          width="md"
          name="thumbCode"
          label="图号"
          readonly
        />
        <ProFormText
          width="md"
          name="trademark"
          label="商标"
          readonly
        />
        <ProFormText
          width="md"
          name="batchCode"
          label="批次编号"
          readonly
        />
        <ProFormDateTimePicker
          width="md"
          name="produceTime"
          label="生产时间"
          readonly
        />
        
        {/* 可编辑字段 */}
        <ProFormText
          width="md"
          name="shareBatchCode"
          label="展示批次编号"
          placeholder="请输入展示批次编号"
          rules={[
            {
              required: true,
              message: '展示批次编号为必填项',
            },
          ]}
        />
        <ProFormDateTimePicker
          width="md"
          name="shareProductTime"
          label="展示生产时间"
          placeholder="请选择展示生产时间"
          rules={[
            {
              required: true,
              message: '展示生产时间为必填项',
            },
          ]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default DisplayManagement;

