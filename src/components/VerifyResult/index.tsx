import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { PartInfo } from '@/types';

interface VerifyResultProps {
  part: PartInfo;
  aircraftNo: string;
  position: string;
  positionConfirmed: boolean;
  onPositionChange: (pos: string) => void;
  onPositionConfirm: (confirmed: boolean) => void;
}

const VerifyResult: React.FC<VerifyResultProps> = ({
  part,
  aircraftNo,
  position,
  positionConfirmed,
  onPositionChange,
  onPositionConfirm
}) => {
  const isAircraftMatch = aircraftNo.toUpperCase() === part.lastInstallAircraft.toUpperCase();
  const isPositionMatch = position === part.lastInstallPosition;

  return (
    <View className={styles.container}>
      <View className={styles.section}>
        <Text className={styles.sectionTitle}>位置确认</Text>
        
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>系统记录飞机号</Text>
          <Text className={styles.infoValue}>{part.lastInstallAircraft}</Text>
        </View>

        <View className={classnames(
          styles.infoRow,
          styles.matchRow,
          isAircraftMatch ? styles.match : styles.mismatch
        )}>
          <Text className={styles.infoLabel}>当前飞机号</Text>
          <View className={styles.matchValue}>
            <Text className={styles.infoValue}>{aircraftNo}</Text>
            <Text className={styles.matchIcon}>
              {isAircraftMatch ? '✓ 一致' : '✗ 不一致'}
            </Text>
          </View>
        </View>

        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>系统记录位置</Text>
          <Text className={styles.infoValue}>{part.lastInstallPosition}</Text>
        </View>

        <View className={classnames(
          styles.infoRow,
          styles.matchRow,
          isPositionMatch ? styles.match : styles.mismatch
        )}>
          <Text className={styles.infoLabel}>确认位置</Text>
          <View className={styles.matchValue}>
            <Text className={styles.infoValue}>{position}</Text>
            <Text className={styles.matchIcon}>
              {isPositionMatch ? '✓ 一致' : '✗ 不一致'}
            </Text>
          </View>
        </View>
      </View>

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>寿命信息</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>总寿命小时</Text>
          <Text className={styles.infoValue}>{part.totalHours.toLocaleString('zh-CN')} FH</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>总寿命循环</Text>
          <Text className={styles.infoValue}>{part.totalCycles.toLocaleString('zh-CN')} FC</Text>
        </View>
      </View>

      {part.melRestriction && (
        <View className={classnames(styles.section, styles.warningSection)}>
          <Text className={styles.warningTitle}>MEL 限制</Text>
          <Text className={styles.warningText}>{part.melRestriction}</Text>
        </View>
      )}

      {part.cdlRestriction && (
        <View className={classnames(styles.section, styles.dangerSection)}>
          <Text className={styles.dangerTitle}>CDL 限制</Text>
          <Text className={styles.dangerText}>{part.cdlRestriction}</Text>
        </View>
      )}

      <View className={styles.section}>
        <Text className={styles.sectionTitle}>装机记录</Text>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>最近装机日期</Text>
          <Text className={styles.infoValue}>{part.lastInstallDate}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>装机签署人</Text>
          <Text className={styles.infoValue}>{part.lastInstallSigner}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>装机飞机</Text>
          <Text className={styles.infoValue}>{part.lastInstallAircraft}</Text>
        </View>
        <View className={styles.infoRow}>
          <Text className={styles.infoLabel}>装机位置</Text>
          <Text className={styles.infoValue}>{part.lastInstallPosition}</Text>
        </View>
      </View>
    </View>
  );
};

export default VerifyResult;
