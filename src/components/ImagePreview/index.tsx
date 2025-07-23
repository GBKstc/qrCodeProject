import React, { useState } from 'react';
import { Modal, Image } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

interface ImagePreviewProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
  showPreviewIcon?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt = '图片',
  width = 40,
  height = 40,
  style = {},
  className = '',
  showPreviewIcon = true
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handlePreview = () => {
    setPreviewImage(src);
    setPreviewOpen(true);
  };

  const defaultStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    objectFit: 'contain',
    borderRadius: '4px',
    border: '1px solid #d9d9d9',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    ...style
  };

  const hoverStyle: React.CSSProperties = {
    transform: 'scale(1.05)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  };

  return (
    <>
      <div 
        style={{ position: 'relative', display: 'inline-block' }}
        className={className}
      >
        <img
          src={src}
          alt={alt}
          style={defaultStyle}
          onClick={handlePreview}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, hoverStyle);
          }}
          onMouseLeave={(e) => {
            Object.assign(e.currentTarget.style, defaultStyle);
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            const parent = (e.target as HTMLImageElement).parentElement;
            if (parent) {
              parent.innerHTML = `<span style="color: #999; font-size: 12px;">${src}</span>`;
            }
          }}
        />
        {showPreviewIcon && (
          <div
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '2px',
              padding: '2px',
              opacity: 0,
              transition: 'opacity 0.3s ease'
            }}
            className="preview-icon"
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0';
            }}
          >
            {/* <EyeOutlined style={{ color: 'white', fontSize: '10px' }} /> */}
          </div>
        )}
      </div>
      
      <Modal
        open={previewOpen}
        title={alt}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        width="auto"
        centered
        bodyStyle={{ padding: '20px', textAlign: 'center' }}
      >
        <Image
          src={previewImage}
          alt={alt}
          style={{ maxWidth: '100%', maxHeight: '70vh' }}
          preview={false}
        />
      </Modal>
    </>
  );
};

export default ImagePreview;