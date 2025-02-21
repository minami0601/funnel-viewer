import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

export type FunnelData = {
  step: string;
  value: number;
  percentage: number;
};

export type FunnelSection = {
  title: string;
  data: FunnelData[];
};

export async function getSheetData() {
  try {
    const csvPath = path.join(process.cwd(), 'date.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log('Parsed CSV records:', records[records.length - 1]); // デバッグログ
    return records;
  } catch (error) {
    console.error('Error reading/parsing CSV file:', error);
    return [];
  }
}

export async function getFunnelData(): Promise<FunnelSection[]> {
  const data = await getSheetData();
  if (data.length === 0) return [];

  console.log('Latest data:', data[data.length - 1]); // デバッグログを追加

  const latestData = data[data.length - 1];

  const createFunnelSteps = (prefix: string, label: string, skipFriends: boolean = false): FunnelData[] => {
    const baseSteps = [
      { key: `${prefix}回答数`, label: '回答' },
      { key: `${prefix}特典受取`, label: '特典受取' },
      { key: `${prefix}コンサル申込`, label: 'コンサル申込' },
      { key: `${prefix}コンサル日程調整済`, label: '日程調整' },
      { key: `${prefix}コンサル実施`, label: 'コンサル実施' },
      { key: `${prefix}紹介`, label: '紹介' },
      { key: `${prefix}成約`, label: '成約' },
    ];

    const steps = skipFriends ? baseSteps : [
      { key: `${prefix}友だち数`, label: '友だち' },
      ...baseSteps
    ];

    const funnelData = steps.map((step, index) => {
      const currentValue = Number(latestData[step.key]) || 0;
      if (index === steps.length - 1) {
        return {
          step: step.label,
          value: currentValue,
          percentage: 0
        };
      }

      const nextStep = steps[index + 1];
      const nextValue = Number(latestData[nextStep.key]) || 0;

      return {
        step: step.label,
        value: currentValue,
        percentage: currentValue === 0 ? 0 : Math.min((nextValue / currentValue) * 100, 100)
      };
    });

    return funnelData;
  };

  const createTotalFunnelSteps = (): FunnelData[] => {
    const steps = [
      { key: '友だち数', labels: ['新規友だち数', '既存友だち数'] },
      { key: '回答数', labels: ['新規回答数', '既存回答数'] },
      { key: '特典受取', labels: ['新規特典受取', '既存特典受取'] },
      { key: 'コンサル申込', labels: ['新規コンサル申込', '既存コンサル申込'] },
      { key: '日程調整', labels: ['新規コンサル日程調整済', '既存コンサル日程調整済'] },
      { key: 'コンサル実施', labels: ['新規コンサル実施', '既存コンサル実施'] },
      { key: '紹介', labels: ['新規紹介', '既存紹介'] },
      { key: '成約', labels: ['新規成約', '既存成約'] },
    ];

    const funnelData = steps.map((step, index) => {
      const currentValue = step.labels.reduce((sum, label) => sum + (Number(latestData[label]) || 0), 0);
      if (index === steps.length - 1) {
        return {
          step: step.key,
          value: currentValue,
          percentage: 0
        };
      }

      const nextStep = steps[index + 1];
      const nextValue = nextStep.labels.reduce((sum, label) => sum + (Number(latestData[label]) || 0), 0);

      return {
        step: step.key,
        value: currentValue,
        percentage: currentValue === 0 ? 0 : Math.min((nextValue / currentValue) * 100, 100)
      };
    });

    return funnelData;
  };

  return [
    {
      title: '全体',
      data: createTotalFunnelSteps()
    },
    {
      title: 'ユーザー種別',
      data: [
        ...createFunnelSteps('新規', '新規友だち'),
        ...createFunnelSteps('既存', '既存友だち')
      ]
    },
    {
      title: '職業別',
      data: [
        ...createFunnelSteps('会社員', '会社員', true),
        ...createFunnelSteps('フリーランス', 'フリーランス', true)
      ]
    },
    {
      title: '経験年数別',
      data: [
        ...createFunnelSteps('未経験', '未経験', true),
        ...createFunnelSteps('1年未満', '1年未満', true),
        ...createFunnelSteps('1年~2年', '1-2年', true),
        ...createFunnelSteps('2年~3年', '2-3年', true),
        ...createFunnelSteps('3年~4年', '3-4年', true),
        ...createFunnelSteps('4年以上', '4年以上', true)
      ]
    },
    {
      title: '年収別',
      data: [
        ...createFunnelSteps('20万円以下', '～20万円', true),
        ...createFunnelSteps('20万円~40万円', '20-40万円', true),
        ...createFunnelSteps('40万円~60万円', '40-60万円', true),
        ...createFunnelSteps('60万円~80万円', '60-80万円', true),
        ...createFunnelSteps('80万円~100万円', '80-100万円', true),
        ...createFunnelSteps('100万円以上', '100万円～', true)
      ]
    }
  ];
}
