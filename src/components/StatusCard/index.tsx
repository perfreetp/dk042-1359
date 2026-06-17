import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { VerifyStatus } from '@/types';
import { getStatusColor, getStatusText } from '@/utils';

interface StatusCardProps {
  status: VerifyStatus;
  partName: string;
  serialNumber: string;
  isLifeControl: boolean;
  remainingHours: number;
  remainingCycles: number;
}

const StatusCard: React.FC<StatusCardProps> = ({
  status,
  partName,
  serialNumber,
  isLifeControl,
  remainingHours,
  remainingCycles
}) => {
  const statusColor = getStatusColor(status);
  const statusText = getStatusText(status);

  const formatHours = (h: number): string => {
    if (h >= 99999) return '-';
    return h.toLocaleString('zh-CN');
  };

  const formatCycles = (c: number): string => {
    if (c >= 99999) return '-';
    return c.toLocaleString('zh-CN');
  };

  return (
    <View 
      className={classnames(styles.statusCard, styles[`status-${status}`])}
      style={{ borderLeftColor: statusColor }}
    >
      <View className={styles.statusBadge} style={{ backgroundColor: statusColor }}>
        <Text className={styles.statusText}>{statusText}</Text>
      </View>
      
      <View className={styles.partInfo}>
        <Text className={styles.partName}>{partName}</Text>
        <Text className={styles.serialNumber}>序号：{serialNumber}</Text>
      </View>

      <View className={styles.lifeBadge}>
        <Text className={styles.lifeText}>
          {isLifeControl ? '寿命控制件' : '非寿命控制件'}
        </Text>
      </View>

      <View className={styles.remainingContainer}>
        <View className={styles.remainingItem}>
          <Text className={styles.remainingLabel}>剩余小时</Text>
          <Text 
            className={classnames(
              styles.remainingValue,
              remainingHours <= 0 && styles.danger,
              remainingHours > 0 && remainingHours <= 200 && styles.warning
            )}
          >
            {formatHours(remainingHours)}
            <Text className={styles.unit}> FH</Text>
          </Text>
        </View>
        <View className={styles.divider} />
        <View className={styles.remainingItem}>
          <Text className={styles.remainingLabel}>剩余循环</Text>
          <Text 
            className={classnames(
              styles.remainingValue,
              remainingCycles <= 0 && styles.danger,
              remainingCycles > 0 && remainingCycles <= 100 && styles.warning
            )}
          >
            {formatCycles(remainingCycles)}
            <Text className={styles.unit}> FC</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StatusCard;
