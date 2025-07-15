import { EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
  ProDescriptions,
} from '@ant-design/pro-components';
import { Button, Modal, QRCode, message } from 'antd';
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { getProductionInfoList, ProductionInfoItem } from '@/services/production/productionInfo';
import { getDisplayList } from '@/services/production/display';

const ProductionInfoManagement: React.FC = () => {
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ProductionInfoItem>();
  const [allProcesses, setAllProcesses] = useState<string[]>([]);
  const [displayConfig, setDisplayConfig] = useState<API.DisplayItem[]>([]);
  const actionRef = useRef<ActionType>();

  // 获取展示配置
  const fetchDisplayConfig = async () => {
    try {
      const response = await getDisplayList({
        currPage: 1,
        pageSize: 999,
        isShow: 1, // 只获取需要显示的字段
      });
      if (response.success && response.data?.records) {
        setDisplayConfig(response.data.records);
      }
    } catch (error) {
      console.error('获取展示配置失败:', error);
    }
  };

  useEffect(() => {
    fetchDisplayConfig();
  }, []);

  const handleViewDetail = (record: ProductionInfoItem) => {
    setCurrentRow(record);
    setDetailModalOpen(true);
  };

  // 字段映射配置
  const fieldMapping: Record<string, any> = {
    qrcodeUrl: {
      title: '二维码',
      dataIndex: 'qrcodeUrl',
      width: 100,
      search: false,
      render: (_, record) => (
        <QRCode
          value={record.qrcodeUrl}
          size={50}
          style={{ cursor: 'pointer' }}
          onClick={() => handleViewDetail(record)}
        />
      ),
    },
    qrcodeCode: {
      title: '二维码编号',
      dataIndex: 'qrcodeId',
      width: 120,
      search: false,
    },
    size: {
      title: '型号',
      dataIndex: 'size',
      width: 120,
      ellipsis: true,
    },
    thumbCode: {
      title: '图号',
      dataIndex: 'thumbCode',
      width: 120,
      ellipsis: true,
    },
    trademark: {
      title: '商标',
      dataIndex: 'trademark',
      width: 120,
      ellipsis: true,
    },
    colour: {
      title: '釉色',
      dataIndex: 'colour',
      width: 100,
      ellipsis: true,
    },
    shareProductTime: {
      title: '生产时间',
      dataIndex: 'shareProductTime',
      valueType: 'dateTime',
      width: 160,
      search: false,
    },
    batchCode: {
      title: '批次号',
      dataIndex: 'shareBatchCode',
      width: 120,
      ellipsis: true,
    },
  };

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
    ];

    // 根据展示配置动态添加列
    const dynamicColumns: ProColumns<ProductionInfoItem>[] = [];
    displayConfig.forEach((config) => {
      if (config.isShow === 1 && fieldMapping[config.code]) {
        const columnConfig = {
          ...fieldMapping[config.code],
          title: config.name, // 使用接口返回的名称
        };
        dynamicColumns.push(columnConfig);
      }
    });

    // 添加其他固定列
    const otherColumns: ProColumns<ProductionInfoItem>[] = [
      // {
      //   title: '生产时间范围',
      //   dataIndex: 'shareProductTimeRange',
      //   valueType: 'dateTimeRange',
      //   hideInTable: true,
      //   search: {
      //     transform: (value) => {
      //       return {
      //         startShareProductTime: value[0],
      //         endShareProductTime: value[1],
      //       };
      //     },
      //   },
      // },
      // {
      //   title: '操作人',
      //   dataIndex: 'operateName',
      //   width: 120,
      //   ellipsis: true,
      // },
      // {
      //   title: '备注',
      //   dataIndex: 'remark',
      //   width: 150,
      //   ellipsis: true,
      //   search: false,
      // },
      // {
      //   title: '创建时间',
      //   dataIndex: 'createTime',
      //   valueType: 'dateTime',
      //   width: 160,
      //   search: false,
      // },
    ];

    

    // 操作列
    const actionColumn: ProColumns<ProductionInfoItem> = {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 80,
      fixed: 'right',
      render: (_, record) => [
        <Button
          key="view"
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          查看
        </Button>,
      ],
    };

    return [...baseColumns, ...dynamicColumns, ...otherColumns];
  }, [allProcesses, displayConfig]);

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

  return (
    <PageContainer>
      <ProTable<ProductionInfoItem>
        headerTitle="生产信息管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        // scroll={{ x: 2000 + allProcesses.length * 280 }} // 动态调整滚动宽度
        pagination={{
          pageSize: 10,
          // showSizeChanger: true,
          // showQuickJumper: true,
        }}
        request={async (params, sort, filter) => {
          try {
            const response = await getProductionInfoList({
              ...params,
              currPage: params.current,
              pageSize: params.pageSize,
            });
            
            if (response.success) {
              // 提取工序信息并更新状态
              const processes = extractProcesses(response.data.records);
              setAllProcesses(processes);
              
              return {
                data: response.data.records,
                success: true,
                total: response.data.total,
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
            console.error('获取生产信息列表失败:', error);
            message.error('获取数据失败，请重试');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columns={columns}
      />

      <Modal
        title="生产信息详情"
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setDetailModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width={1400}
        style={{ top: 20 }}
        bodyStyle={{ padding: '24px', maxHeight: '80vh', overflowY: 'auto' }}
      >
        {currentRow && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 基本信息区域 */}
            <div style={{ 
              background: '#fafafa', 
              padding: '20px', 
              borderRadius: '8px',
              border: '1px solid #f0f0f0'
            }}>
              <ProDescriptions
                title={<span style={{ fontSize: '16px', fontWeight: 600, color: '#1890ff' }}>基本信息</span>}
                column={3}
                dataSource={currentRow}
                labelStyle={{ fontWeight: 500, color: '#666' }}
                contentStyle={{ color: '#333' }}
                columns={[
                  {
                    title: '二维码',
                    dataIndex: 'qrcodeUrl',
                    span: 1,
                    render: () => (
                      <div style={{ textAlign: 'center', padding: '10px' }}>
                        <QRCode 
                          value={currentRow.qrcodeUrl} 
                          size={120} 
                          style={{ border: '1px solid #d9d9d9', borderRadius: '4px' }}
                        />
                      </div>
                    ),
                  },
                  {
                    title: '二维码ID',
                    dataIndex: 'qrcodeId',
                  },
                  {
                    title: '型号',
                    dataIndex: 'size',
                  },
                  {
                    title: '图号',
                    dataIndex: 'thumbCode',
                  },
                  {
                    title: '商标',
                    dataIndex: 'trademark',
                  },
                  {
                    title: '釉色',
                    dataIndex: 'colour',
                  },
                  {
                    title: '操作人',
                    dataIndex: 'operateName',
                  },
                  {
                    title: '备注',
                    dataIndex: 'remark',
                  },
                  {
                    title: '创建时间',
                    dataIndex: 'createTime',
                  },
                  {
                    title: '更新时间',
                    dataIndex: 'updateTime',
                  },
                ]}
              />
            </div>
            
            {/* 生产工序信息区域 */}
            {currentRow.produceUserList && currentRow.produceUserList.length > 0 && (
              <div style={{ 
                background: '#f9f9f9', 
                padding: '20px', 
                borderRadius: '8px',
                border: '1px solid #f0f0f0'
              }}>
                <div style={{ 
                  marginBottom: '16px', 
                  paddingBottom: '12px', 
                  borderBottom: '2px solid #1890ff'
                }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    color: '#1890ff'
                  }}>
                    生产工序信息
                  </h3>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                  gap: '16px'
                }}>
                  {currentRow.produceUserList.map((item, index) => (
                    <div
                      key={item.id}
                      style={{
                        background: '#fff',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid #e8e8e8',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ 
                        marginBottom: '12px', 
                        paddingBottom: '8px', 
                        borderBottom: '1px solid #f0f0f0'
                      }}>
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: 600, 
                          color: '#1890ff',
                          background: '#e6f7ff',
                          padding: '4px 8px',
                          borderRadius: '4px'
                        }}>
                          工序{index + 1}: {item.productionProcessesName}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ 
                            fontWeight: 500, 
                            color: '#666', 
                            minWidth: '80px',
                            fontSize: '13px'
                          }}>
                            操作人员:
                          </span>
                          <span style={{ 
                            color: '#333',
                            padding: '2px 6px',
                            background: '#f6ffed',
                            borderRadius: '3px',
                            fontSize: '13px'
                          }}>
                            {item.operateName}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ 
                            fontWeight: 500, 
                            color: '#666', 
                            minWidth: '80px',
                            fontSize: '13px'
                          }}>
                            创建时间:
                          </span>
                          <span style={{ color: '#333', fontSize: '13px' }}>
                            {item.createTime}
                          </span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ 
                            fontWeight: 500, 
                            color: '#666', 
                            minWidth: '80px',
                            fontSize: '13px'
                          }}>
                            更新时间:
                          </span>
                          <span style={{ color: '#333', fontSize: '13px' }}>
                            {item.updateTime}
                          </span>
                        </div>
                        
                        {item.remark && (
                          <div style={{ marginTop: '4px' }}>
                            <span style={{ 
                              fontWeight: 500, 
                              color: '#666', 
                              fontSize: '13px'
                            }}>
                              备注:
                            </span>
                            <div style={{ 
                              marginTop: '4px',
                              padding: '6px 8px',
                              background: '#fff7e6',
                              border: '1px solid #ffd591',
                              borderRadius: '4px',
                              color: '#d46b08',
                              fontSize: '12px',
                              lineHeight: '1.4'
                            }}>
                              {item.remark}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default ProductionInfoManagement;

