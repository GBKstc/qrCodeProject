/**
 * 二维码相关工具函数
 */

/**
 * 根据二维码ID生成二维码URL
 * @param qrId 二维码编号
 * @returns 完整的二维码URL
 */
export const generateQRCodeUrl = (qrId: string | number, qrcode: string | number): string => {
  console.log(qrId, qrcode)

  // 使用 define 配置的全局变量
  const apiHost = REACT_APP_API_HOST || '175.24.15.119';
  const baseUrl = `http://${apiHost}:91/qrcode`;
  return `${baseUrl}?qrcodeId=${qrId}&qrcode=${qrcode}`;
};

/**
 * 验证二维码ID是否有效
 * @param qrId 二维码编号
 * @returns 是否有效
 */
export const isValidQRCodeId = (qrId: any): boolean => {
  if (qrId === null || qrId === undefined || qrId === '') {
    return false;
  }
  return true;
};

