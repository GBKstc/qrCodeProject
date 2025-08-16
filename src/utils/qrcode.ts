/**
 * 二维码相关工具函数
 */

/**
 * 根据二维码ID生成二维码URL
 * @param qrId 二维码编号
 * @returns 完整的二维码URL
 */
export const generateQRCodeUrl = (qrId: string | number): string => {
  const apiHost = process.env.REACT_APP_API_HOST || '175.24.15.119';
  const baseUrl = `http://${apiHost}:91/qrcode`;
  return `${baseUrl}?qrid=${qrId}`;
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

/**
 * 安全生成二维码URL，会验证ID有效性
 * @param qrId 二维码编号
 * @returns 二维码URL或空字符串
 */
export const safeGenerateQRCodeUrl = (qrId: any): string => {
  if (!isValidQRCodeId(qrId)) {
    return '';
  }
  return generateQRCodeUrl(qrId);
};