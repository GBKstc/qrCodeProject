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
import { ImagePreview } from '@/components';
import React, { useRef, useState, useMemo } from 'react';
import { getProductionInfoList, ProductionInfoItem } from '@/services/production/productionInfo';
import { request } from '@umijs/max';
import { generateQRCodeUrl } from '@/utils/qrcode';

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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<ProductionInfoItem[]>([]);
  const [allProcesses, setAllProcesses] = useState<string[]>([]);
  const actionRef = useRef<ActionType>();

  // 获取展示模块列表
  const getShowModuleList = async () => {
    setLoading(true);
    try {
      const response = await request('/api/daciProduceShow/pageList', {
        method: 'GET',
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
        headers: {
          'Content-Type': 'application/json',
        },
        data: [{
          code: record.code || "",
          del: 0,
          id: record.id || 0,
          isShow: isShow ? 1 : 0,
          name: record.name || "",
          operateId: record.operateId || 0,
          operateName: record.operateName || "",
          remark: record.remark || ""
        }],
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

  // 批量删除功能
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的记录');
      return;
    }

    try {
      // 批量删除请求
      const deletePromises = selectedRows.map(record => 
        request('/api/daciProduce/saveOrUpdate', {
          method: 'POST',
          data: {
            id: record.id,
            del: 1,
          },
        })
      );

      const responses = await Promise.all(deletePromises);
      const failedCount = responses.filter(response => !response.success).length;
      
      if (failedCount === 0) {
        message.success(`成功删除 ${selectedRowKeys.length} 条记录`);
        setSelectedRowKeys([]);
        setSelectedRows([]);
        actionRef.current?.reload();
      } else {
        message.error(`删除失败 ${failedCount} 条记录，请重试`);
      }
    } catch (error) {
      message.error('批量删除失败，请重试');
    }
  };

  // 编辑按钮点击
  const handleEdit = (record: ProductionInfoItem) => {
    setCurrentRow(record);
    handleUpdateModalOpen(true);
  };

  // 从数据中提取所有工序名称
  const extractProcesses = (data: ProductionInfoItem[]) => {
    const processSet = new Set<string>();
    data.forEach(item => {
      item.produceUserList?.forEach(process => {
        if (process.productionProcessesName) {
          processSet.add(process.productionProcessesName);
        }
      });
    });
    return Array.from(processSet).sort();
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

  // 动态生成列配置
  const columns: ProColumns<ProductionInfoItem>[] = useMemo(() => {
    const baseColumns: ProColumns<ProductionInfoItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
      fixed: 'left',
      search: false,
    },
    {
      title: '二维码',
      dataIndex: 'qrcodeUrl',
      width: 100,
      search: false,
      render: (_, record) => {
        const qrCodeUrl = generateQRCodeUrl(record.qrcodeId);
        return (
          <div onClick={() => {
                Modal.info({
                  title: '二维码详情',
                  content: (
                    <div style={{paddingTop:"20px",marginLeft:'-22px',display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection: 'column'}}>
                      <QRCode value={qrCodeUrl} size={200} />
                      <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                        二维码ID: {record.qrcodeId}
                      </p>
                    </div>
                  ),
                  // width: 300,
                  centered: true,
                  okText: '关闭'
                });
              }} style={{ display: 'flex', justifyContent: 'center' }}>
            <QRCode
              value={qrCodeUrl}
              size={50}
              style={{ cursor: 'pointer' }}
              
            />
          </div>
        );
      },
    },
    {
      title: '二维码编号',
      dataIndex: 'qrcodeCode',
      width: 120,
      ellipsis: true,
      filters: true,
      onFilter: true,
      valueType: 'text',
    },
    {
      title: '型号',
      dataIndex: 'size',
      width: 120,
      ellipsis: true,
      filters: true,
      onFilter: true,
      valueType: 'text',
    },
    {
      title: '图号',
      dataIndex: 'thumbCode',
      width: 120,
      ellipsis: true,
      filters: true,
      onFilter: true,
      valueType: 'text',
    },
    {
      title: '商标',
      dataIndex: 'trademark',
      width: 120,
      search: false,
      render: (text: string) => {
        if (!text) return '-';
        return (
          <ImagePreview
            src={text}
            alt="商标"
            width={40}
            height={40}
          />
        );
      },
    },
    {
      title: '生产时间',
      dataIndex: 'produceTime',
      valueType: 'dateTime',
      width: 160,
      search: false,
      filters: true,
      onFilter: true,
      valueType: 'dateTime',
    },
    {
      title: '展示生产时间',
      dataIndex: 'shareProductTime',
      valueType: 'dateTime',
      width: 160,
      search: false,
      filters: true,
      onFilter: true,
      valueType: 'dateTime',
    },
    {
      title: '批次编号',
      dataIndex: 'batchCode',
      width: 120,
      ellipsis: true,
      filters: true,
      onFilter: true,
      valueType: 'text',
    },
    {
      title: '展示批次编号',
      dataIndex: 'shareBatchCode',
      width: 120,
      ellipsis: true,
      filters: true,
      onFilter: true,
      valueType: 'text',
    }];

    // 动态生成工序列
    const processColumns: ProColumns<ProductionInfoItem>[] = [];
    
    allProcesses.forEach((processName) => {
      // 扫码时间列
      processColumns.push({
        title: `${processName}扫码时间`,
        dataIndex: `${processName}_scanTime`,
        valueType: 'dateTime',
        width: 160,
        search: false,
        render: (_, record) => {
          const processItem = record.produceUserList?.find(
            item => item.productionProcessesName === processName
          );
          return processItem?.updateTime || '-';
        },
      });
      
      // 操作人员列
      processColumns.push({
        title: `${processName}操作人员`,
        dataIndex: `${processName}_operator`,
        width: 120,
        search: false,
        ellipsis: true,
        render: (_, record) => {
          const processItem = record.produceUserList?.find(
            item => item.productionProcessesName === processName
          );
          return processItem?.operateName || '-';
        },
      });
    });

    // 操作列
    const actionColumn: ProColumns<ProductionInfoItem> = {
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
    };

    return [...baseColumns, ...processColumns, actionColumn];
  }, [allProcesses]);

  return (
    <PageContainer>
      <ProTable<ProductionInfoItem>
        headerTitle="展示信息管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        scroll={{ x: 1400 + allProcesses.length * 280 }} // 动态调整滚动宽度
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
          selectedRowKeys.length > 0 && (
            <Popconfirm
              key="batchDelete"
              title={`确定删除选中的 ${selectedRowKeys.length} 条记录吗？`}
              onConfirm={handleBatchDelete}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
              >
                批量删除 ({selectedRowKeys.length})
              </Button>
            </Popconfirm>
          ),
        ].filter(Boolean)}
        request={async (params) => {
          try {
            const response = await getProductionInfoList({
              currPage: params.current,
              pageSize: params.pageSize,
              qrcodeId: params.qrcodeId,
              qrcodeCode: params.qrcodeCode,
              size: params.size,
              thumbCode: params.thumbCode,
              trademark: params.trademark,
              batchCode: params.batchCode,
              shareBatchCode: params.shareBatchCode,
            });
            
            if (response.success) {
              // 提取工序信息并更新状态
              const processes = extractProcesses(response.data?.records || []);
              setAllProcesses(processes);
              
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
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys: React.Key[], newSelectedRows: ProductionInfoItem[]) => {
            setSelectedRowKeys(newSelectedRowKeys);
            setSelectedRows(newSelectedRows);
          },
          onSelect: (record: ProductionInfoItem, selected: boolean, newSelectedRows: ProductionInfoItem[]) => {
            console.log('选择行:', record, selected, newSelectedRows);
          },
          onSelectAll: (selected: boolean, newSelectedRows: ProductionInfoItem[], changeRows: ProductionInfoItem[]) => {
            console.log('全选:', selected, newSelectedRows, changeRows);
          },
        }}
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
          <span>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
            <a style={{ marginLeft: 24 }} onClick={onCleanSelected}>
              取消选择
            </a>
          </span>
        )}
        tableAlertOptionRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
          <span>
            <Popconfirm
              title={`确定删除选中的 ${selectedRowKeys.length} 条记录吗？`}
              onConfirm={() => {
                handleBatchDelete();
                onCleanSelected();
              }}
              okText="确定"
              cancelText="取消"
            >
              <a>批量删除</a>
            </Popconfirm>
          </span>
        )}
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

