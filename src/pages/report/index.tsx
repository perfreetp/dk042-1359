import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Input, Button, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useReportStore } from '@/store/useReportStore';
import type { ReportItem } from '@/types';

type TabType = 'form' | 'history';
type ReportType = 'blurry' | 'mismatch' | 'noRecord';

const reportTypes: { value: ReportType; label: string; desc: string }[] = [
  { value: 'blurry', label: '铭牌模糊', desc: '铭牌磨损、油污覆盖，序号无法辨认' },
  { value: 'mismatch', label: '序号不符', desc: '实物序号与系统记录不一致' },
  { value: 'noRecord', label: '系统无记录', desc: '系统中查询不到该件号信息' }
];

const ReportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('form');
  const [historyList, setHistoryList] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    reportType,
    serialNumber,
    partName,
    flightNo,
    parkingPosition,
    photos,
    remark,
    isLoading: isSubmitting,
    setReportType,
    setSerialNumber,
    setPartName,
    setFlightNo,
    setParkingPosition,
    addPhoto,
    removePhoto,
    setRemark,
    submitReport,
    loadReportList,
    resetState
  } = useReportStore();

  const loadData = useCallback(async () => {
    console.log('[ReportPage] 加载上报历史');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      loadReportList();
      const state = useReportStore.getState();
      setHistoryList(state.reportList);
    } catch (err) {
      console.error('[ReportPage] 加载失败:', err);
    } finally {
      setIsLoading(false);
      Taro.stopPullDownRefresh();
    }
  }, [loadReportList]);

  useEffect(() => {
    if (activeTab === 'history') {
      loadData();
    }
  }, [activeTab, loadData]);

  useDidShow(() => {
    console.log('[ReportPage] 页面显示');
    if (activeTab === 'history') {
      loadData();
    }
  });

  usePullDownRefresh(() => {
    console.log('[ReportPage] 下拉刷新');
    if (activeTab === 'history') {
      loadData();
    } else {
      Taro.stopPullDownRefresh();
    }
  });

  const handleChooseImage = useCallback(() => {
    console.log('[ReportPage] 选择图片');
    Taro.chooseImage({
      count: 9 - photos.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('[ReportPage] 图片选择成功:', res.tempFilePaths);
        res.tempFilePaths.forEach(path => {
          addPhoto(path);
        });
      },
      fail: (err) => {
        console.error('[ReportPage] 图片选择失败:', err);
        if (err.errMsg !== 'chooseImage:fail cancel') {
          Taro.showToast({ title: '选择图片失败', icon: 'none' });
        }
      }
    });
  }, [photos.length, addPhoto]);

  const handleRemovePhoto = useCallback((index: number) => {
    console.log('[ReportPage] 移除图片:', index);
    removePhoto(index);
  }, [removePhoto]);

  const handleSubmit = useCallback(async () => {
    if (!serialNumber.trim()) {
      Taro.showToast({ title: '请输入航材序号', icon: 'none' });
      return;
    }
    if (!flightNo.trim()) {
      Taro.showToast({ title: '请输入航班号', icon: 'none' });
      return;
    }
    if (!parkingPosition.trim()) {
      Taro.showToast({ title: '请输入停场位置', icon: 'none' });
      return;
    }

    console.log('[ReportPage] 提交异常报告');
    const success = await submitReport();

    if (success) {
      Taro.showToast({
        title: '上报成功',
        icon: 'success'
      });
      
      setTimeout(() => {
        resetState();
        setActiveTab('history');
        loadData();
      }, 1500);
    } else {
      Taro.showToast({ title: '上报失败，请重试', icon: 'none' });
    }
  }, [serialNumber, flightNo, parkingPosition, submitReport, resetState, loadData]);

  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      pending: '#FF7D00',
      processing: '#165DFF',
      resolved: '#00B42A'
    };
    return colorMap[status] || '#86909C';
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.tabs}>
        <View 
          className={classnames(styles.tab, activeTab === 'form' && styles.active)}
          onClick={() => setActiveTab('form')}
        >
          <Text className={classnames(styles.tabText, activeTab === 'form' && styles.active)}>
            异常上报
          </Text>
        </View>
        <View 
          className={classnames(styles.tab, activeTab === 'history' && styles.active)}
          onClick={() => setActiveTab('history')}
        >
          <Text className={classnames(styles.tabText, activeTab === 'history' && styles.active)}>
            上报记录
          </Text>
        </View>
      </View>

      <View className={styles.content}>
        {activeTab === 'form' ? (
          <View>
            <View className={styles.formSection}>
              <Text className={styles.sectionTitle}>异常类型</Text>
              <View className={styles.typeSelector}>
                {reportTypes.map(type => (
                  <View 
                    key={type.value}
                    className={classnames(
                      styles.typeOption,
                      reportType === type.value && styles.selected
                    )}
                    onClick={() => setReportType(type.value)}
                  >
                    <View className={classnames(
                      styles.typeRadio,
                      reportType === type.value && styles.selected
                    )}>
                      {reportType === type.value && (
                        <View className={styles.typeRadioInner} />
                      )}
                    </View>
                    <View className={styles.typeContent}>
                      <Text className={styles.typeName}>{type.label}</Text>
                      <Text className={styles.typeDesc}>{type.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.formSection}>
              <Text className={styles.sectionTitle}>航材信息</Text>
              
              <View className={styles.formRow}>
                <Text className={styles.formLabel}>
                  <Text className={styles.formRequired}>*</Text>
                  航材序号
                </Text>
                <Input
                  className={styles.formInput}
                  placeholder="请扫描或输入航材序号"
                  value={serialNumber}
                  onInput={(e) => setSerialNumber(e.detail.value.toUpperCase())}
                  confirmType="next"
                />
              </View>

              <View className={styles.formRow}>
                <Text className={styles.formLabel}>航材名称</Text>
                <Input
                  className={styles.formInput}
                  placeholder="请输入航材名称（选填）"
                  value={partName}
                  onInput={(e) => setPartName(e.detail.value)}
                  confirmType="next"
                />
              </View>
            </View>

            <View className={styles.formSection}>
              <Text className={styles.sectionTitle}>航班信息</Text>
              
              <View className={styles.formRow}>
                <Text className={styles.formLabel}>
                  <Text className={styles.formRequired}>*</Text>
                  航班号
                </Text>
                <Input
                  className={styles.formInput}
                  placeholder="请输入航班号，如 CA1234"
                  value={flightNo}
                  onInput={(e) => setFlightNo(e.detail.value.toUpperCase())}
                  confirmType="next"
                />
              </View>

              <View className={styles.formRow}>
                <Text className={styles.formLabel}>
                  <Text className={styles.formRequired}>*</Text>
                  停场位置
                </Text>
                <Input
                  className={styles.formInput}
                  placeholder="请输入停场位置，如 T2-15号桥位"
                  value={parkingPosition}
                  onInput={(e) => setParkingPosition(e.detail.value)}
                  confirmType="done"
                />
              </View>
            </View>

            <View className={styles.formSection}>
              <Text className={styles.sectionTitle}>现场照片</Text>
              <View className={styles.photoSection}>
                <View className={styles.photoGrid}>
                  {photos.map((photo, index) => (
                    <View key={index} className={styles.photoItem}>
                      <Image
                        className={styles.photoImg}
                        src={photo}
                        mode="aspectFill"
                        onClick={() => {
                          Taro.previewImage({
                            current: photo,
                            urls: photos
                          });
                        }}
                        onError={(e) => console.error('[ReportPage] 图片加载失败:', e)}
                      />
                      <View 
                        className={styles.photoRemove}
                        onClick={() => handleRemovePhoto(index)}
                      >
                        ✕
                      </View>
                    </View>
                  ))}
                  
                  {photos.length < 9 && (
                    <View className={styles.photoAdd} onClick={handleChooseImage}>
                      <Text className={styles.photoAddIcon}>📷</Text>
                      <Text className={styles.photoAddText}>
                        {photos.length}/9
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View className={styles.formRow}>
                <Text className={styles.formLabel}>补充说明</Text>
                <Input
                  className={styles.formTextarea}
                  placeholder="请描述异常情况（选填）"
                  value={remark}
                  onInput={(e) => setRemark(e.detail.value)}
                />
              </View>
            </View>
          </View>
        ) : (
          <View className={styles.historySection}>
            {isLoading ? (
              <View className={styles.loading}>
                <Text>加载中...</Text>
              </View>
            ) : historyList.length > 0 ? (
              historyList.map(item => (
                <View 
                  key={item.id}
                  className={classnames(styles.historyItem, styles[`status-${item.status}`])}
                >
                  <View className={styles.historyHeader}>
                    <Text className={styles.historyType}>{item.typeText}</Text>
                    <View 
                      className={classnames(styles.historyStatus, item.status)}
                      style={{ backgroundColor: getStatusColor(item.status) }}
                    >
                      {item.statusText}
                    </View>
                  </View>
                  <Text className={styles.historySerial}>
                    {item.partName} · {item.serialNumber}
                  </Text>
                  <View className={styles.historyMeta}>
                    <Text>✈️ {item.flightNo}</Text>
                    <Text>📍 {item.parkingPosition}</Text>
                  </View>
                  <View className={styles.historyMeta}>
                    <Text>🕐 {item.reportTime}</Text>
                    <Text>👤 {item.reportUser}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View className={styles.emptyHistory}>
                <Text className={styles.emptyIcon}>📋</Text>
                <Text className={styles.emptyText}>暂无上报记录</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {activeTab === 'form' && (
        <View className={styles.submitSection}>
          <Button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={isSubmitting || !serialNumber || !flightNo || !parkingPosition}
          >
            {isSubmitting ? '提交中...' : '提交上报'}
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

export default ReportPage;
