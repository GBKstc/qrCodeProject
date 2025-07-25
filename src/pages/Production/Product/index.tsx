import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProFormUploadButton,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Image } from 'antd';
import type { UploadFile } from 'antd';
import React, { useRef, useState } from 'react';
import { getProductList, saveOrUpdateProduct, removeProduct } from '@/services/production/product';

type ProductItem = {
  id: number;
  batchCode: string;
  thumbCode: string;
  size: string;
  trademark: string;
  colour: string;
  productThumb?: string;
  trademarkImage?: string; // 新增商标图片字段
  operateId?: number;
  operateName?: string;
  remark?: string;
  createTime?: string;
  updateTime?: string;
};

const ProductManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<ProductItem | undefined>();
  const actionRef = useRef<ActionType>();

  const handleCreate = async (values: any) => {
    try {
      // 处理产品图片上传
      const productThumb = values.productThumb?.[0]?.response?.data?.url || 
                        values.productThumb?.[0]?.response?.url || 
                        values.productThumb?.[0]?.url || '';
      
      // 处理商标图片上传 - 注意这里应该是商标图片，不是商标名称
      const trademarkImage = values.trademark?.[0]?.response?.data?.url || 
                          values.trademark?.[0]?.response?.url || 
                          values.trademark?.[0]?.url || '';
      
      // 获取当前用户信息（这里需要根据实际的用户状态管理来获取）
      // const currentUser = getCurrentUser(); // 需要实现获取当前用户的方法
      
      const requestData = {
        batchCode: values.batchCode || '',
        colour: values.colour || '',
        // id: 0, // 新增时不需要传id
        operateId: 0, // 需要传入当前操作用户的ID
        operateName: '', // 需要传入当前操作用户的姓名
        productThumb: productThumb,
        remark: values.remark || '',
        size: values.size || '',
        thumbCode: values.thumbCode || '',
        trademark: trademarkImage, // 这里存储的是商标图片URL
      };
      
      const response = await saveOrUpdateProduct(requestData);
      
      if (response.success) {
        message.success('产品创建成功');
        handleModalOpen(false);
        actionRef.current?.reload();
        return true;
      } else {
        // 根据新的响应格式处理错误
        // const errorMsg = response.message || 
        //               response.reason?.errMsg || 
        //               '创建失败';
        // message.error(errorMsg);
        return false;
      }
    } catch (error) {
      console.error('创建产品失败:', error);
      // message.error('创建失败，请重试');
      return false;
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      if (!currentRecord?.id) {
        message.error('缺少产品ID，无法更新');
        return false;
      }
      console.log(values,"values")
      // 处理产品图片上传 - 修复逻辑
      let productThumb = '';
      if (values.productThumb && values.productThumb.length > 0) {
        const file = values.productThumb[0];
        // 新上传的文件
        if (file.response) {
          productThumb = file.response.data?.url || file.response.url || '';
        }
        // 现有的文件
        else if (file.url) {
          productThumb = file.url;
        }
      } else {
        // 如果没有文件，保持原有的图片
        productThumb = currentRecord?.productThumb || '';
      }
      
      // 处理商标图片上传 - 修复逻辑
      let trademark = '';
      if (values.trademark && values.trademark.length > 0) {
        const file = values.trademark[0];
        // 新上传的文件
        if (file.response) {
          trademark = file.response.data?.url || file.response.url || '';
        }
        // 现有的文件
        else if (file.url) {
          trademark = file.url;
        }
      } else {
        // 如果没有文件，保持原有的图片
        trademark = currentRecord?.trademark || '';
      }
      
      const requestData = {
        id: currentRecord.id,
        batchCode: values.batchCode || '',
        colour: values.colour || '',
        operateId: currentRecord.operateId || 0,
        operateName: currentRecord.operateName || '',
        productThumb: productThumb,
        remark: values.remark || '',
        size: values.size || '',
        thumbCode: values.thumbCode || '',
        trademark: trademark,
      };
      
      console.log('更新产品数据:', requestData); // 添加调试日志
      
      const response = await saveOrUpdateProduct(requestData);
      
      if (response.success) {
        message.success('产品更新成功');
        setEditModalOpen(false);
        setCurrentRecord(undefined);
        actionRef.current?.reload();
        return true;
      } else {
        // 根据新的响应格式处理错误
        const errorMsg = response.message || 
                      response.reason?.errMsg || 
                      '更新失败';
        message.error(errorMsg);
        return false;
      }
    } catch (error) {
      console.error('更新产品失败:', error);
      message.error('更新失败，请重试');
      return false;
    }
  };

  const handleDelete = async (record: ProductItem) => {
    try {
      const response = await removeProduct(record.id);
      if (response.success) {
        message.success('产品删除成功');
        actionRef.current?.reload();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      message.error('删除失败，请重试');
    }
  };

  // 图片上传前的验证
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 格式的图片!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error('图片大小不能超过 10MB!');
      return false;
    }
    return true;
  };


  // 真实图片上传处理
  const handleRealUpload = async (file: File) => {
    // 文件验证
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('文件大小不能超过10MB');
    }
    
    // 创建 FormData 对象
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // 使用 fetch API 发送 POST 请求
      const response = await fetch('/api/index/upload', {
        method: 'POST',
        body: formData,  // 直接传递 FormData 对象
      });
      
      // 检查 HTTP 状态码
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // 根据业务逻辑处理响应
      if (result.success) {
        return {
          url: result.data,
          status: 'done',
          name: file.name,
        };
      } else {
        throw new Error(result.message || '上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      throw error;
    }
  };

  const columns: ProColumns<ProductItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 60,
      search: false,
    },
    {
      title: '批次',
      dataIndex: 'batchCode',
      ellipsis: true,
      // width: 120,
    },
    {
      title: '图号',
      dataIndex: 'thumbCode',
      ellipsis: true,
      // width: 120,
    },
    {
      title: '型号',
      dataIndex: 'size',
      ellipsis: true,
      // width: 120,
    },
    {
      title: '商标',
      dataIndex: 'trademark',
      ellipsis: true,
      // width: 100,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {record.trademark && (
            <Image
              width={30}
              height={30}
              src={record.trademark}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              preview={{
                mask: '预览',
              }}
            />
          )}
        </div>
      ),
    },
    {
      title: '釉色',
      dataIndex: 'colour',
      ellipsis: true,
      // width: 100,
    },
    {
      title: '操作人',
      dataIndex: 'operateName',
      search: false,
      ellipsis: true,
      // width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
      ellipsis: true,
      hideInTable: true, // 隐藏备注列
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
      valueType: 'dateTime',
      // width: 150,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      // width: 120,
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentRecord(record);
            setEditModalOpen(true);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确认删除"
          description="确定要删除这个产品吗？"
          onConfirm={() => handleDelete(record)}
          okText="确认"
          cancelText="取消"
        >
          <a style={{ color: '#ff4d4f' }}>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  const handlePreview = (file) => {
    console.log(file,'file')
    // 优先获取直接的url字段（编辑时的现有文件）
    let imageUrl = file.url;
    
    // 如果没有直接的url，尝试从response中获取（重新上传的文件）
    if (!imageUrl && file.response) {
      imageUrl = file.response.url || file.response.response?.url;
    }
    
    // 如果还是没有，尝试thumbUrl
    if (!imageUrl) {
      imageUrl = file.thumbUrl;
    }
    
    if (imageUrl) {
      window.open(imageUrl);
    } else {
      console.error('无法获取图片URL', file);
    }
  }

  return (
    <PageContainer>
      <ProTable<ProductItem>
        headerTitle="产品管理"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建产品
          </Button>,
        ]}
        request={async (params) => {
          try {
            const response = await getProductList({
              currPage: params.current || 1,
              pageSize: params.pageSize || 10,
              batchCode: params.batchCode,
              thumbCode: params.thumbCode,
              size: params.size,
              trademark: params.trademark,
              colour: params.colour,
            });
            
            if (response.success && response.data) {
              return {
                data: Array.isArray(response.data.records) ? response.data.records : [],
                success: true,
                total: response.data.total || 0,
              };
            } else {
              console.error('API返回错误:', response.message);
              return {
                data: [],
                success: false,
                total: 0,
              };
            }
          } catch (error) {
            console.error('请求失败:', error);
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
          showSizeChanger: true,
        }}
      />
      
      {/* 新建产品表单 */}
      {/* 新建产品表单 */}
      <ModalForm
        title="新建产品"
        width="600px"
        open={createModalOpen}
        key={createModalOpen ? 'create' : 'create-closed'} // 添加 key 属性强制重新渲染
        onOpenChange={handleModalOpen}
        onFinish={handleCreate}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <ProFormText
          rules={[{ required: true, message: '型号为必填项' }]}
          name="size"
          label="型号"
          placeholder="请输入产品型号"
        />
        <ProFormText
          rules={[{ required: true, message: '图号为必填项' }]}
          name="thumbCode"
          label="图号"
          placeholder="请输入产品图号"
        />
        <ProFormText
          rules={[{ required: true, message: '批次为必填项' }]}
          name="batchCode"
          label="批次"
          placeholder="请输入产品批次"
        />
        <ProFormText
          rules={[{ required: true, message: '釉色为必填项' }]}
          name="colour"
          label="釉色"
          placeholder="请输入釉色"
        />
        <ProFormUploadButton
          rules={[{ required: true, message: '产品图片为必填项' }]}
          name="productThumb"
          label="产品图片"
          max={1}
          
          fieldProps={{
            onPreview:handlePreview,
            name: 'file',
            listType: 'picture-card',
            beforeUpload,
            customRequest: ({ file, onSuccess, onError }) => {
              handleRealUpload(file as File)
                .then((response) => {
                  // 构造符合 Ant Design Upload 组件期望的文件对象
                  const fileObj = {
                    uid: file.uid || Date.now().toString(),
                    name: file.name,
                    status: 'done',
                    url: response.url,
                    response: response, // 保留原始响应
                  };
                  onSuccess?.(fileObj, file);
                })
                .catch((error) => {
                  onError?.(error);
                });
            },
          }}
          extra="支持 JPG、PNG 格式，文件大小不超过 10MB"
        />
        <ProFormUploadButton
          rules={[{ required: true, message: '商标图片为必填项' }]}
          name="trademark"
          label="商标图片"
          max={1}
          fieldProps={{
            onPreview:handlePreview,
            name: 'file',
            listType: 'picture-card',
            beforeUpload,
            customRequest: ({ file, onSuccess, onError }) => {
              handleRealUpload(file as File)
                .then((response) => {
                  console.log(response,'response')
                  // 构造符合 Ant Design Upload 组件期望的文件对象
                  const fileObj = {
                    uid: file.uid || Date.now().toString(),
                    name: file.name,
                    status: 'done',
                    url: response.url,
                    response: response, // 保留原始响应
                  };
                  onSuccess?.(fileObj, file);
                })
                .catch((error) => {
                  onError?.(error);
                });
            },
          }}
          extra="支持 JPG、PNG 格式，文件大小不超过 10MB"
        />
      </ModalForm>

      {/* 编辑产品表单 */}
      <ModalForm
        title="编辑产品"
        width="600px"
        open={editModalOpen}
        onOpenChange={(open) => {
          setEditModalOpen(open);
          if (!open) {
            setCurrentRecord(undefined); // 关闭时清空当前记录
          }
        }}
        onFinish={handleUpdate}
        // 使用 key 强制重新渲染表单
        key={currentRecord?.id || 'new'}
        initialValues={{
          size: currentRecord?.size || '',
          thumbCode: currentRecord?.thumbCode || '',
          batchCode: currentRecord?.batchCode || '',
          colour: currentRecord?.colour || '',
          remark: currentRecord?.remark || '',
          productThumb: currentRecord?.productThumb ? [{
            uid: '-1',
            name: 'product.jpg',
            status: 'done' as const,
            url: currentRecord.productThumb,
          }] : [],
          trademark: currentRecord?.trademark ? [{
            uid: '-2',
            name: 'trademark.jpg',
            status: 'done' as const,
            url: currentRecord.trademark,
          }] : [],
        }}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <ProFormText
          rules={[{ required: true, message: '型号为必填项' }]}
          name="size"
          label="型号"
          placeholder="请输入产品型号"
        />
        <ProFormText
          rules={[{ required: true, message: '图号为必填项' }]}
          name="thumbCode"
          label="图号"
          placeholder="请输入产品图号"
        />
        <ProFormText
          rules={[{ required: true, message: '批次为必填项' }]}
          name="batchCode"
          label="批次"
          placeholder="请输入产品批次"
        />
        <ProFormText
          rules={[{ required: true, message: '釉色为必填项' }]}
          name="colour"
          label="釉色"
          placeholder="请输入釉色"
        />
        
        <ProFormUploadButton
          rules={[{ required: true, message: '产品图片为必填项' }]}
          name="productThumb"
          label="产品图片"
          max={1}
          fieldProps={{
            onPreview:handlePreview,
            name: 'file',
            listType: 'picture-card',
            beforeUpload,
            customRequest: ({ file, onSuccess, onError }) => {
              handleRealUpload(file as File)
                .then((response) => {
                  // 构造符合 Ant Design Upload 组件期望的文件对象
                  console.log(response,'response')
                  const fileObj = {
                    uid: file.uid || Date.now().toString(),
                    name: file.name,
                    status: 'done',
                    url: response.url, // 这是关键：设置图片URL
                    response: response,
                  };
                  onSuccess?.(fileObj, file);
                })
                .catch((error) => {
                  onError?.(error);
                });
            },
          }}
          extra="支持 JPG、PNG 格式，文件大小不超过 2MB"
        />
        <ProFormUploadButton
          rules={[{ required: true, message: '商标图片为必填项' }]}
          name="trademark"
          label="商标图片"
          max={1}
          fieldProps={{
            onPreview:handlePreview,
            name: 'file',
            listType: 'picture-card',
            beforeUpload,
            customRequest: ({ file, onSuccess, onError }) => {
              handleRealUpload(file as File)
                .then((response) => {
                  // 构造符合 Ant Design Upload 组件期望的文件对象
                  const fileObj = {
                    uid: file.uid || Date.now().toString(),
                    name: file.name,
                    status: 'done',
                    url: response.url,
                    response: response,
                  };
                  onSuccess?.(fileObj, file);
                })
                .catch((error) => {
                  onError?.(error);
                });
            },
          }}
          extra="支持 JPG、PNG 格式，文件大小不超过 10MB"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default ProductManagement;