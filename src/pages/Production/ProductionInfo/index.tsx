import { EyeOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProTable,
  ProDescriptions,
} from '@ant-design/pro-components';
import { Button, Modal, QRCode, message } from 'antd';
import { ImagePreview } from '@/components';
import React, { useRef, useState, useMemo } from 'react';
import { getProductionInfoList, ProductionInfoItem } from '@/services/production/productionInfo';
import { generateQRCodeUrl } from '@/utils/qrcode';

const ProductionInfoManagement: React.FC = () => {
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<ProductionInfoItem>();
  const [allProcesses, setAllProcesses] = useState<string[]>([]);
  const actionRef = useRef<ActionType>();

  const handleViewDetail = (record: ProductionInfoItem) => {
    // console.log(record)
    record.qrcodeUrl = generateQRCodeUrl(record.qrcodeId);
    setCurrentRow(record);
    setDetailModalOpen(true);
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
      // {
      //   title: '二维码',
      //   dataIndex: 'qrcodeUrl',
      //   width: 100,
      //   search: false,
      //   render: (_, record) => {
      //     const qrCodeUrl = generateQRCodeUrl(record.qrcodeId);
      //     return (
      //       <div onClick={() => {
      //             Modal.info({
      //               title: '二维码详情',
      //               content: (
      //                 <div style={{paddingTop:"20px",marginLeft:'-22px',display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection: 'column'}}>
      //                   <QRCode value={qrCodeUrl} size={200} />
      //                   <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
      //                     二维码ID: {record.qrcodeId}
      //                   </p>
      //                 </div>
      //               ),
      //               // width: 300,
      //               centered: true,
      //               okText: '关闭'
      //             });
      //           }} style={{ display: 'flex', justifyContent: 'center' }}>
      //         <QRCode
      //           value={qrCodeUrl}
      //           size={50}
      //           style={{ cursor: 'pointer' }}
                
      //         />
      //       </div>
      //     );
      //   },
      // },
      {
        title: '二维码编号',
        dataIndex: 'qrcodeCode',
        width: 120,
        search: false,
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
      // {
      //   title: '商标',
      //   dataIndex: 'trademark',
      //   width: 120,
      //   render: (text: string) => {
      //     if (!text) return '-';
      //     return (
      //       <ImagePreview
      //         src={text}
      //         alt="商标"
      //         width={40}
      //         height={40}
      //       />
      //     );
      //   },
      // },
      {
        title: '批次编号',
        dataIndex: 'batchCode',
        width: 120,
        ellipsis: true,
      },
      // {
      //   title: '釉色',
      //   dataIndex: 'colour',
      //   width: 100,
      //   ellipsis: true,
      //   search: false,
      // },
      {
        title: '生产时间',
        dataIndex: 'produceTime',
        valueType: 'dateTime',
        width: 160,
        search: false,
      },
      {
        title: '生产时间',
        dataIndex: 'produceTimeRange',
        valueType: 'dateTimeRange',
        hideInTable: true,
        search: {
          transform: (value) => {
            return {
              startProduceTime: value[0],
              endProduceTime: value[1],
            };
          },
        },
      },
      {
        title: '工序',
        dataIndex: 'processName',
        valueType: 'select',
        hideInTable: true,
        valueEnum: allProcesses.reduce((acc, process) => {
          acc[process] = { text: process };
          return acc;
        }, {} as Record<string, { text: string }>),
        fieldProps: {
          placeholder: '请选择工序',
          allowClear: true,
        },
      },
      {
        title: '工序时间',
        dataIndex: 'processTimeRange',
        valueType: 'dateTimeRange',
        hideInTable: true,
        dependencies: ['processName'],
        fieldProps: {
          placeholder: ['开始时间', '结束时间'],
        },
        search: {
          transform: (value, namePath, allValues) => {
            if (!allValues.processName || !value) {
              return {};
            }
            return {
              processName: allValues.processName,
              startProcessTime: value[0],
              endProcessTime: value[1],
            };
          },
        },
      },
      // {
      //   title: '展示生产时间',
      //   dataIndex: 'shareProductTime',
      //   valueType: 'dateTime',
      //   width: 160,
      //   search: false,
      // },
      // {
      //   title: '展示生产时间范围',
      //   dataIndex: 'shareProductTimeRange',
      //   valueType: 'dateTimeRange',
      //   hideInTable: true,
      //   search: false,
      // },
      // {
      //   title: '展示序列号',
      //   dataIndex: 'shareBatchCode',
      //   width: 120,
      //   ellipsis: true,
      //   search: false,
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

    return [...baseColumns, ...processColumns, actionColumn];
  }, [allProcesses]);

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
          defaultCollapsed: false, // 搜索项默认展开
        }}
        scroll={{ x: 2000 + allProcesses.length * 280 }} // 动态调整滚动宽度
        pagination={{
          pageSize: 10,
          // showSizeChanger: true,
          // showQuickJumper: true,
        }}
        request={async (params, sort, filter) => {
          try {
            // 处理工序时间筛选参数
            const requestParams: any = {
              ...params,
              currPage: params.current,
              pageSize: params.pageSize,
              startProduceTime: params.startProduceTime,
              endProduceTime: params.endProduceTime,
            };
            
            // 如果有工序时间筛选，添加相关参数
            if (params.processName && params.startProcessTime && params.endProcessTime) {
              requestParams.processName = params.processName;
              requestParams.startProcessTime = params.startProcessTime;
              requestParams.endProcessTime = params.endProcessTime;
            }
            
            const response = await getProductionInfoList(requestParams);
            
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
                    title: '二维码编号',
                    dataIndex: 'qrcodeCode',
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
                    title: '批次',
                    dataIndex: 'batchCode',
                  },
                  {
                    title: '釉色',
                    dataIndex: 'colour',

                    render: (text) => (
                      <span style={{ 
                        padding: '4px 8px', 
                        background: '#f6ffed', 
                        border: '1px solid #b7eb8f',
                        borderRadius: '4px',
                        color: '#52c41a'
                      }}>
                        {text}
                      </span>
                    ),
                  },
                  {
                    title: '生产时间',
                    dataIndex: 'produceTime',
                    valueType: 'dateTime',
                  },
                  {
                    title: '展示生产时间',
                    dataIndex: 'shareProductTime',
                    valueType: 'dateTime',
                  },
                  // {
                  //   title: '展示序列号',
                  //   dataIndex: 'shareBatchCode',
                  // },
                  // {
                  //   title: '操作人',
                  //   dataIndex: 'operateName',
                  //   render: (text) => (
                  //     <span style={{ 
                  //       padding: '4px 8px', 
                  //       background: '#e6f7ff', 
                  //       border: '1px solid #91d5ff',
                  //       borderRadius: '4px',
                  //       color: '#1890ff'
                  //     }}>
                  //       {text}
                  //     </span>
                  //   ),
                  // },
                  // {
                  //   title: '备注',
                  //   dataIndex: 'remark',
                  //   span: 3,
                  //   render: (text) => (
                  //     <div style={{ 
                  //       padding: '8px 12px', 
                  //       background: '#fff7e6', 
                  //       border: '1px solid #ffd591',
                  //       borderRadius: '4px',
                  //       minHeight: '40px',
                  //       color: '#d46b08'
                  //     }}>
                  //       {text || '暂无备注'}
                  //     </div>
                  //   ),
                  // },
                  {
                    title: '创建时间',
                    dataIndex: 'createTime',
                    valueType: 'dateTime',
                  },
                  {
                    title: '更新时间',
                    dataIndex: 'updateTime',
                    valueType: 'dateTime',
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