import { PlusOutlined, DownloadOutlined, EditOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Tag } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { getQRCodeList, saveOrUpdateQRCode, exportQRCode, deleteQRCode, getEquipmentList } from '@/services/production';
import { Tooltip } from 'antd';

const QRCodeManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<any>();
  const [deviceOptions, setDeviceOptions] = useState<{ label: string; value: number }[]>([]);
  const actionRef = useRef<ActionType>();

  // 获取设备列表
  const fetchDeviceOptions = async () => {
    try {
      const response = await getEquipmentList({
        currPage: 1,
        pageSize: 1000, // 获取所有设备
        type:1 //1喷码机 2PDA

      });
      
      if (response.success && response.data?.records) {
        const options = response.data.records.map((device: any) => ({
          label: device.name || `设备${device.id}`,
          value: device.id,
        }));
        setDeviceOptions(options);
      }
    } catch (error) {
      console.error('获取设备列表失败:', error);
      message.error('获取设备列表失败');
    }
  };

  useEffect(() => {
    fetchDeviceOptions();
  }, []);

  // 新增二维码
  const handleCreate = async (values: any) => {
    try {
      const response = await saveOrUpdateQRCode({
        // batchCode: values.batchCode, // 移除序列号
        num: values.num,
        // sort: values.sort, // 移除排序
        url: values.url,
      });
      
      if (response.success) {
        message.success('新增二维码成功');
        handleModalOpen(false);
        actionRef.current?.reload();
        return true;
      } else {
        message.error(response.message || '新增失败');
        return false;
      }
    } catch (error) {
      message.error('新增失败，请重试');
      return false;
    }
  };

  // 编辑二维码
  const handleUpdate = async (values: any) => {
    try {
      const response = await saveOrUpdateQRCode({
        id: currentRecord?.id,
        batchCode: values.batchCode,
        num: values.num,
        sort: values.sort,
        url: values.url,
      });
      
      if (response.success) {
        message.success('更新二维码成功');
        handleUpdateModalOpen(false);
        setCurrentRecord(undefined);
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

  // 导出二维码 - 更新为使用正确的接口参数
  const handleExport = async (values: any) => {
    window.open('/api/daciQrcode/export'+'?id='+currentRecord?.id+'&deviceId='+values.deviceId);
    setExportModalOpen(false);
    setCurrentRecord(undefined);
    // try {
    //   // 根据接口文档，导出接口需要 id 和 deviceId 作为 query 参数
    //   const response = await exportQRCode({
    //     id: currentRecord?.id,
    //     deviceId: values.deviceId,
    //   });
      
    //   if (response.success) {
    //     message.success('二维码导出成功');
    //     setExportModalOpen(false);
    //     setCurrentRecord(undefined);
    //     actionRef.current?.reload();
    //     return true;
    //   } else {
    //     message.error(response.message || '导出失败');
    //     return false;
    //   }
    // } catch (error) {
    //   message.error('导出失败，请重试');
    //   return false;
    // }
  };

  const handleDelete = async (record: any) => {
    try {
      const response = await saveOrUpdateQRCode({
        id: record.id,
        del: 1,
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

  const columns: ProColumns<any>[] = [
    {
      title: '二维码序列号',
      dataIndex: 'batchCode',
      copyable: true,
      ellipsis: true,
      fixed: 'left', // 固定左侧重要列
    },
    {
      title: '编号',
      dataIndex: 'code',
      ellipsis: true,
      search: false,
      hideInTable: true, // 隐藏编号列
    },
    {
      title: '数量',
      dataIndex: 'num',
      search: false,
      render: (text) => (
        <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
          {text}
        </span>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      search: false,
      responsive: ['lg'],
      hideInTable: true, // 隐藏排序列
    },
    {
      title: '访问URL',
      dataIndex: 'url',
      ellipsis: true,
      search: false,
      responsive: ['xl'],
      render: (text) =>text,
    },
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      search: false,
      responsive: ['lg'],
      hideInTable: true, // 隐藏设备ID列
    },
    {
      title: '操作人',
      dataIndex: 'operateName',
      ellipsis: true,
      responsive: ['md'],
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => {
        const statusMap = {
          0: { text: '未使用', color: 'blue' },
          1: { text: '已使用', color: 'green' },
        };
        const status = statusMap[record.status] || { text: '未知', color: 'default' };
        return <Tag color={status.color}>{status.text}</Tag>;
      },
      valueEnum: {
        0: { text: '未使用', status: 'processing' },
        1: { text: '已使用', status: 'success' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
      responsive: ['lg'],
    },
    {
      title: '备注',
      dataIndex: 'remark',
      ellipsis: true,
      search: false,
      responsive: ['xl'],
      hideInTable: true, // 隐藏备注列
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => [
        // <a
        //   key="edit"
        //   onClick={() => {
        //     setCurrentRecord(record);
        //     handleUpdateModalOpen(true);
        //   }}
        // >
        //   <EditOutlined /> 编辑
        // </a>,
        // 在操作列中
        record.status === 1 ? (
        <Tooltip title="该二维码已使用，不允许重复导出" key="export">
          <span style={{ color: '#ccc', cursor: 'not-allowed' }}>
            <DownloadOutlined /> 已导出
          </span>
        </Tooltip>
        ) : (
        <a
          key="export"
          onClick={() => {
          setCurrentRecord(record);
          setExportModalOpen(true);
        }}
        >
         <DownloadOutlined /> 导出
        </a>
        ),
        <Popconfirm
          key="delete"
          title="确认删除"
          description="确定要删除这个二维码吗？删除后无法恢复。"
          onConfirm={() => handleDelete(record)}
          okText="确认"
          cancelText="取消"
        >
          <a style={{ color: '#ff4d4f' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<any>
        headerTitle="二维码管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        scroll={{ x: 'max-content' }} // 添加横向滚动
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新增二维码
          </Button>,
        ]}
        request={async (params) => {
          try {
            const response = await getQRCodeList({
              currPage: params.current,
              pageSize: params.pageSize,
              batchCode: params.batchCode,
              code: params.code,
              operateName: params.operateName,
              status: params.status,
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
            message.error('获取数据失败，请重试');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
         
        }}
      />
      
      {/* 新增二维码表单 */}
      <ModalForm
        title="新增二维码"
        width="500px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        onFinish={handleCreate}
        key={createModalOpen ? 'create' : 'create-closed'} // 添加 key 属性强制重新渲染
        initialValues={{
          url: 'http://175.24.15.119:91/product-detail' // 添加默认URL值
        }}
      >
        <ProFormDigit
          rules={[
            { required: true, message: '数量为必填项' },
            // { min: 1, message: '数量必须大于0' },
          ]}
          width="md"
          name="num"
          label="数量"
          placeholder="请输入二维码数量"
          min={1}
          fieldProps={{
            precision: 0,
          }}
        />
        <ProFormText
          rules={[
            { required: true, message: '访问URL为必填项' },
            { type: 'url', message: '请输入有效的URL地址' },
          ]}
          width="md"
          name="url"
          label="访问URL"
          placeholder="请输入二维码访问地址"
          extra="二维码扫描后跳转的URL地址"
        />
      </ModalForm>

      {/* 编辑二维码表单 */}
      <ModalForm
        title="编辑二维码"
        width="500px"
        open={updateModalOpen}
        onOpenChange={handleUpdateModalOpen}
        initialValues={currentRecord}
        onFinish={handleUpdate}
        key={currentRecord?.id} // 添加 key 属性
      >
        <ProFormText
          rules={[
            { required: true, message: '序列号为必填项' },
          ]}
          width="md"
          name="batchCode"
          label="序列号"
          placeholder="请输入二维码序列号"
        />
        <ProFormDigit
          rules={[
            { required: true, message: '数量为必填项' },
            { min: 1, message: '数量必须大于0' },
          ]}
          width="md"
          name="num"
          label="数量"
          placeholder="请输入二维码数量"
          min={1}
          fieldProps={{
            precision: 0,
          }}
        />
        <ProFormDigit
          width="md"
          name="sort"
          label="排序"
          placeholder="请输入排序号"
          min={0}
          fieldProps={{
            precision: 0,
          }}
        />
        <ProFormText
          rules={[
            { required: true, message: '访问URL为必填项' },
            { type: 'url', message: '请输入有效的URL地址' },
          ]}
          width="md"
          name="url"
          label="访问URL"
          placeholder="请输入二维码访问地址"
          extra="二维码扫描后跳转的URL地址"
        />
      </ModalForm>

      {/* 导出二维码表单 - 更新为使用真实设备列表 */}
      <ModalForm
        title="导出二维码"
        width="500px"
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        onFinish={handleExport}
      >
        <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#f6f6f6', borderRadius: 4 }}>
          <p style={{ margin: 0, color: '#666' }}>
            二维码编号：{currentRecord?.id}<br/>
            序列号：{currentRecord?.batchCode}<br/>
            数量：{currentRecord?.num} 个
          </p>
        </div>
        <ProFormSelect
          name="deviceId"
          label="选择目标设备"
          width="md"
          options={deviceOptions}
          rules={[{ required: true, message: '请选择目标设备' }]}
          placeholder="请选择要导出到的设备"
          extra="选择将二维码导出到哪个设备"
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        />
      </ModalForm>
    </PageContainer>
  );
};

export default QRCodeManagement;