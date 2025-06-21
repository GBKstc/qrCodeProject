import { PageContainer } from '@ant-design/pro-components';
import { Card, Row, Col, Statistic, Progress, List, Badge } from 'antd';
import React from 'react';

const EquipmentOverview: React.FC = () => {
  // 模拟设备状态数据
  const equipmentStats = {
    total: 24,
    running: 18,
    idle: 4,
    maintenance: 1,
    fault: 1,
  };

  const equipmentList = [
    { name: '成型机A', status: 'running', efficiency: 95, location: '车间A-01' },
    { name: '成型机B', status: 'running', efficiency: 88, location: '车间A-02' },
    { name: '检测设备A', status: 'idle', efficiency: 0, location: '车间B-01' },
    { name: '传送带C', status: 'maintenance', efficiency: 0, location: '车间C-01' },
    { name: '包装机D', status: 'fault', efficiency: 0, location: '车间D-01' },
  ];

  const statusMap = {
    running: { text: '运行中', color: 'green' },
    idle: { text: '空闲', color: 'blue' },
    maintenance: { text: '维护中', color: 'orange' },
    fault: { text: '故障', color: 'red' },
  };

  return (
    <PageContainer title="设备状态概览">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="设备总数"
              value={equipmentStats.total}
              suffix="台"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="运行中"
              value={equipmentStats.running}
              suffix="台"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="空闲"
              value={equipmentStats.idle}
              suffix="台"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="故障/维护"
              value={equipmentStats.fault + equipmentStats.maintenance}
              suffix="台"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="设备运行率">
            <Progress
              type="circle"
              percent={Math.round((equipmentStats.running / equipmentStats.total) * 100)}
              format={(percent) => `${percent}%`}
              size={120}
            />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <p>总体运行率</p>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="设备状态分布">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title="运行中" value={equipmentStats.running} suffix={`/ ${equipmentStats.total}`} />
              </Col>
              <Col span={12}>
                <Statistic title="空闲" value={equipmentStats.idle} suffix={`/ ${equipmentStats.total}`} />
              </Col>
              <Col span={12}>
                <Statistic title="维护中" value={equipmentStats.maintenance} suffix={`/ ${equipmentStats.total}`} />
              </Col>
              <Col span={12}>
                <Statistic title="故障" value={equipmentStats.fault} suffix={`/ ${equipmentStats.total}`} />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="设备实时状态">
            <List
              dataSource={equipmentList}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{item.name}</span>
                        <Badge
                          color={statusMap[item.status as keyof typeof statusMap].color}
                          text={statusMap[item.status as keyof typeof statusMap].text}
                        />
                      </div>
                    }
                    description={
                      <div>
                        <div>位置: {item.location}</div>
                        {item.status === 'running' && (
                          <div style={{ marginTop: 8 }}>
                            <span>运行效率: </span>
                            <Progress
                              percent={item.efficiency}
                              size="small"
                              style={{ width: 200, display: 'inline-block' }}
                            />
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default EquipmentOverview;