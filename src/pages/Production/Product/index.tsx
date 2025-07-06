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
      const productThumb = values.productThumb?.[0]?.response?.url || values.productThumb?.[0]?.url;
      // 处理商标图片上传
      const trademark = values.trademark?.[0]?.response?.url || values.trademark?.[0]?.url;
      
      const response = await saveOrUpdateProduct({
        batchCode: values.batchCode,
        thumbCode: values.thumbCode,
        size: values.size,
        trademark,
        colour: values.colour,
        productThumb,
        remark: values.remark,
      });
      
      if (response.success) {
        message.success('产品创建成功');
        handleModalOpen(false);
        actionRef.current?.reload();
        return true;
      } else {
        message.error(response.message || '创建失败');
        return false;
      }
    } catch (error) {
      message.error('创建失败，请重试');
      return false;
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      // 处理产品图片上传
      const productThumb = values.productThumb?.[0]?.response?.url || values.productThumb?.[0]?.url || currentRecord?.productThumb;
      // 处理商标图片上传
      const trademark = values.trademark?.[0]?.response?.url || values.trademark?.[0]?.url || currentRecord?.trademark;
      
      const response = await saveOrUpdateProduct({
        id: currentRecord?.id,
        batchCode: values.batchCode,
        thumbCode: values.thumbCode,
        size: values.size,
        trademark,
        colour: values.colour,
        productThumb,
        remark: values.remark,
      });
      
      if (response.success) {
        message.success('产品更新成功');
        setEditModalOpen(false);
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
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB!');
      return false;
    }
    return true;
  };

  // 模拟上传处理
  const handleUpload = (file: File) => {
    return new Promise((resolve) => {
      // 模拟上传过程
      setTimeout(() => {
        const url = URL.createObjectURL(file);
        resolve({
          url,
          status: 'done',
          name: file.name,
        });
      }, 1000);
    });
  };

  // 真实图片上传处理
  const handleRealUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/index/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        return {
          url: result.data.url,
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
      valueType: 'indexBorder',
      width: 60,
      search: false,
    },
    {
      title: '批次',
      dataIndex: 'batchCode',
      ellipsis: true,
      width: 120,
    },
    {
      title: '图号',
      dataIndex: 'thumbCode',
      ellipsis: true,
      width: 120,
    },
    {
      title: '型号',
      dataIndex: 'size',
      ellipsis: true,
      width: 120,
    },
    {
      title: '商标',
      dataIndex: 'trademark',
      ellipsis: true,
      width: 100,
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
      width: 100,
    },
    {
      title: '操作人',
      dataIndex: 'operateName',
      search: false,
      ellipsis: true,
      width: 100,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      search: false,
      ellipsis: true,
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
      valueType: 'dateTime',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 120,
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
      <ModalForm
        title="新建产品"
        width="600px"
        open={createModalOpen}
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
        <ProFormText
          name="remark"
          label="备注"
          placeholder="请输入备注"
        />
        <ProFormUploadButton
          name="productThumb"
          label="产品图片"
          max={1}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            beforeUpload,
            customRequest: ({ file, onSuccess, onError }) => {
              handleRealUpload(file as File)
                .then((response) => {
                  onSuccess?.(response);
                })
                .catch((error) => {
                  onError?.(error);
                });
            },
          }}
          extra="支持 JPG、PNG 格式，文件大小不超过 2MB"
        />
        <ProFormUploadButton
          name="trademark"
          label="商标图片"
          max={1}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            beforeUpload,
            customRequest: ({ file, onSuccess, onError }) => {
              handleRealUpload(file as File)
                .then((response) => {
                  onSuccess?.(response);
                })
                .catch((error) => {
                  onError?.(error);
                });
            },
          }}
          extra="支持 JPG、PNG 格式，文件大小不超过 2MB"
        />
      </ModalForm>

      {/* 编辑产品表单 */}
      <ModalForm
        title="编辑产品"
        width="600px"
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onFinish={handleUpdate}
        initialValues={{
          ...currentRecord,
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
        {/* <ProFormText
          rules={[{ required: true, message: '商标名称为必填项' }]}
          name="trademark"
          label="商标名称"
          placeholder="请输入商标名称"
        /> */}
        <ProFormUploadButton
          name="productThumb"
          label="产品图片"
          max={1}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            beforeUpload,
            customRequest: ({ file, onSuccess, onError }) => {
              handleRealUpload(file as File)
                .then((response) => {
                  onSuccess?.(response);
                })
                .catch((error) => {
                  onError?.(error);
                });
            },
          }}
          extra="支持 JPG、PNG 格式，文件大小不超过 2MB"
        />
        <ProFormUploadButton
          name="trademark"
          label="商标图片"
          max={1}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            beforeUpload,
            customRequest: ({ file, onSuccess, onError }) => {
              handleRealUpload(file as File)
                .then((response) => {
                  onSuccess?.(response);
                })
                .catch((error) => {
                  onError?.(error);
                });
            },
          }}
          extra="支持 JPG、PNG 格式，文件大小不超过 2MB"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default ProductManagement;