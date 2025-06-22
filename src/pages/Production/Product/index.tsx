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

type ProductItem = {
  id: string;
  batch: string;
  drawingNumber: string;
  model: string;
  trademark: string;
  glaze: string;
  trademarkImage?: string;
  productImage?: string;
  createTime: string;
};

const ProductManagement: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [currentRecord, setCurrentRecord] = useState<ProductItem | undefined>();
  const actionRef = useRef<ActionType>();

  const handleCreate = async (values: any) => {
    try {
      // 处理图片上传
      const trademarkImage = values.trademarkImage?.[0]?.response?.url || values.trademarkImage?.[0]?.url;
      const productImage = values.productImage?.[0]?.response?.url || values.productImage?.[0]?.url;
      
      const productData = {
        ...values,
        trademarkImage,
        productImage,
        createTime: new Date().toLocaleString(),
      };
      
      console.log('创建产品:', productData);
      message.success('产品创建成功');
      handleModalOpen(false);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('创建失败，请重试');
      return false;
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      // 处理图片上传
      const trademarkImage = values.trademarkImage?.[0]?.response?.url || values.trademarkImage?.[0]?.url || currentRecord?.trademarkImage;
      const productImage = values.productImage?.[0]?.response?.url || values.productImage?.[0]?.url || currentRecord?.productImage;
      
      const productData = {
        ...currentRecord,
        ...values,
        trademarkImage,
        productImage,
      };
      
      console.log('更新产品:', productData);
      message.success('产品更新成功');
      setEditModalOpen(false);
      setCurrentRecord(undefined);
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error('更新失败，请重试');
      return false;
    }
  };

  const handleDelete = async (record: ProductItem) => {
    try {
      console.log('删除产品:', record.id);
      message.success('产品删除成功');
      actionRef.current?.reload();
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
      dataIndex: 'batch',
      ellipsis: true,
      width: 120,
    },
    {
      title: '图号',
      dataIndex: 'drawingNumber',
      ellipsis: true,
      width: 120,
    },
    {
      title: '型号',
      dataIndex: 'model',
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
          {record.trademarkImage && (
            <Image
              width={30}
              height={30}
              src={record.trademarkImage}
              style={{ objectFit: 'cover', borderRadius: 4 }}
              preview={{
                mask: '预览',
              }}
            />
          )}
          <span>{record.trademark}</span>
        </div>
      ),
    },
    {
      title: '釉色',
      dataIndex: 'glaze',
      ellipsis: true,
      width: 100,
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
          description="确定要删除这个产品吗？删除后无法恢复。"
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
        request={async () => {
          // 模拟数据
          const mockData: ProductItem[] = [
            {
              id: '1',
              batch: 'B202401001',
              drawingNumber: 'DWG-001',
              model: 'SM-A1-001',
              trademark: '品牌A',
              glaze: '亮光白',
              trademarkImage: 'https://via.placeholder.com/100x100?text=Logo1',
              productImage: 'https://via.placeholder.com/200x200?text=Product1',
              createTime: '2024-01-01 10:00:00',
            },
            {
              id: '2',
              batch: 'B202401002',
              drawingNumber: 'DWG-002',
              model: 'TB-B2-002',
              trademark: '品牌B',
              glaze: '哑光黑',
              trademarkImage: 'https://via.placeholder.com/100x100?text=Logo2',
              productImage: 'https://via.placeholder.com/200x200?text=Product2',
              createTime: '2024-01-02 14:30:00',
            },
            {
              id: '3',
              batch: 'B202401003',
              drawingNumber: 'DWG-003',
              model: 'LC-C3-003',
              trademark: '品牌C',
              glaze: '珠光蓝',
              trademarkImage: 'https://via.placeholder.com/100x100?text=Logo3',
              productImage: 'https://via.placeholder.com/200x200?text=Product3',
              createTime: '2024-01-03 09:15:00',
            },
          ];
          return {
            data: mockData,
            success: true,
            total: mockData.length,
          };
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
          name="model"
          label="型号"
          placeholder="请输入产品型号"
        />
        <ProFormText
          rules={[{ required: true, message: '图号为必填项' }]}
          name="drawingNumber"
          label="图号"
          placeholder="请输入产品图号"
        />
        <ProFormText
          rules={[{ required: true, message: '批次为必填项' }]}
          name="batch"
          label="批次"
          placeholder="请输入产品批次"
        />
        <ProFormText
          rules={[{ required: true, message: '釉色为必填项' }]}
          name="glaze"
          label="釉色"
          placeholder="请输入釉色"
        />
        <ProFormText
          rules={[{ required: true, message: '商标为必填项' }]}
          name="trademark"
          label="商标"
          placeholder="请输入商标名称"
        />
        <ProFormUploadButton
          name="trademarkImage"
          label="商标图片"
          max={1}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            beforeUpload,
            customRequest: ({ file, onSuccess, onError }) => {
              handleUpload(file as File)
                .then((response) => {
                  onSuccess?.(response);
                })
                .catch((error) => {
                  onError?.(error);
                });
            },
          }}
          rules={[{ required: true, message: '请上传商标图片' }]}
          extra="支持 JPG、PNG 格式，文件大小不超过 2MB"
        />
        <ProFormUploadButton
          name="productImage"
          label="产品图片"
          max={1}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            beforeUpload,
            customRequest: ({ file, onSuccess, onError }) => {
              handleUpload(file as File)
                .then((response) => {
                  onSuccess?.(response);
                })
                .catch((error) => {
                  onError?.(error);
                });
            },
          }}
          rules={[{ required: true, message: '请上传产品图片' }]}
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
          trademarkImage: currentRecord?.trademarkImage ? [{
            uid: '-1',
            name: 'trademark.jpg',
            status: 'done' as const,
            url: currentRecord.trademarkImage,
          }] : [],
          productImage: currentRecord?.productImage ? [{
            uid: '-2',
            name: 'product.jpg',
            status: 'done' as const,
            url: currentRecord.productImage,
          }] : [],
        }}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <ProFormText
          rules={[{ required: true, message: '型号为必填项' }]}
          name="model"
          label="型号"
          placeholder="请输入产品型号"
        />
        <ProFormText
          rules={[{ required: true, message: '图号为必填项' }]}
          name="drawingNumber"
          label="图号"
          placeholder="请输入产品图号"
        />
        <ProFormText
          rules={[{ required: true, message: '批次为必填项' }]}
          name="batch"
          label="批次"
          placeholder="请输入产品批次"
        />
        <ProFormText
          rules={[{ required: true, message: '釉色为必填项' }]}
          name="glaze"
          label="釉色"
          placeholder="请输入釉色"
        />
        <ProFormText
          rules={[{ required: true, message: '商标为必填项' }]}
          name="trademark"
          label="商标"
          placeholder="请输入商标名称"
        />
        <ProFormUploadButton
          name="trademarkImage"
          label="商标图片"
          max={1}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            beforeUpload,
            customRequest: ({ file, onSuccess, onError }) => {
              handleUpload(file as File)
                .then((response) => {
                  onSuccess?.(response);
                })
                .catch((error) => {
                  onError?.(error);
                });
            },
          }}
          rules={[{ required: true, message: '请上传商标图片' }]}
          extra="支持 JPG、PNG 格式，文件大小不超过 2MB"
        />
        <ProFormUploadButton
          name="productImage"
          label="产品图片"
          max={1}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            beforeUpload,
            customRequest: ({ file, onSuccess, onError }) => {
              handleUpload(file as File)
                .then((response) => {
                  onSuccess?.(response);
                })
                .catch((error) => {
                  onError?.(error);
                });
            },
          }}
          rules={[{ required: true, message: '请上传产品图片' }]}
          extra="支持 JPG、PNG 格式，文件大小不超过 2MB"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default ProductManagement;