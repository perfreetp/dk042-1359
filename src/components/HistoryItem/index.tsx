import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { VerifyRecord } from '@/types';
import { getStatusColor, getStatusText } from '@/utils';

interface HistoryItemProps {
  record: VerifyRecord;
  onClick?: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ record, onClick }) => {
  const statusColor = getStatusColor(record.status);
  const statusText = getStatusText(record.status);

  return (
    <View className={styles.item} onClick={onClick}>
      <View className={styles.statusIndicator} style={{ backgroundColor: statusColor }} />
      
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.partName}>{record.partName}</Text>
          <View className={styles.statusBadge} style={{ backgroundColor: statusColor }}>
            <Text className={styles.statusText}>{statusText}</Text>
          </View>
        </View>
        
        <Text className={styles.serial}>序号：{record.serialNumber}</Text>
        
        <View className={styles.meta}>
          <Text className={styles.metaItem}>
            <Text className={styles.metaLabel}>飞机号：</Text>
            <Text className={styles.metaValue}>{record.aircraftNo}</Text>
          </Text>
          <Text className={styles.metaItem}>
            <Text className={styles.metaLabel}>位置：</Text>
            <Text className={styles.metaValue}>{record.position}</Text>
          </Text>
        </View>

        <View className={styles.footer}>
          <Text className={styles.time}>{record.verifyTime}</Text>
          <Text className={styles.user}>核验人：{record.verifyUser}</Text>
        </View>
      </View>
    </View>
  );
};

export default HistoryItem;
