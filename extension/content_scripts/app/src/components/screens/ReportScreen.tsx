import { useEffect, useState } from 'react';
import { ReportType, ReportTypeMeta, ReportTypeOptions } from 'unfold-core';
import { Button, Radio, TextArea, GFML } from 'unfold-ui';
import analytics from '../../utils/analytics';
import api from '../../utils/api';
import { useNavigation } from '../../utils/useNavigation';

export const ReportScreen = (): JSX.Element => {
  return <div></div>;
  // const { current, goToBrowse } = useNavigation<'report'>();

  // const [reportingStatus, setReportingStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  // const [reportType, setReportType] = useState<ReportType | null>(null);
  // const [reportDesc, setReportDesc] = useState('');

  // useEffect(() => {
  //   analytics.events.track('navigation.report', {
  //     entryId: current.entry.id,
  //     title: current.entry.title,
  //     authorId: current.entry.createdBy.id,
  //     authorDisplayName: current.entry.createdBy.displayName,
  //   });
  // }, []);

  // const btnDisabled =
  //   reportingStatus === 'submitting' || reportType === null || (reportType === 'other' && reportDesc.length < 10);

  // const handleSubmit = async () => {
  //   if (reportType === null || btnDisabled) {
  //     return;
  //   }
  //   try {
  //     setReportingStatus('submitting');
  //     const res = await api.report.report({
  //       entryId: current.entry.id,
  //       type: reportType,
  //       text: reportDesc,
  //     });
  //     if (!res) {
  //       return;
  //     }
  //     analytics.events.track('report.created', {
  //       entryId: current.entry.id,
  //       title: current.entry.title,
  //       authorId: current.entry.createdBy.id,
  //       authorDisplayName: current.entry.createdBy.displayName,
  //       reportType: reportType,
  //       reportId: res.reportId,
  //     });

  //     goToBrowse(current.entry);
  //   } catch (err) {
  //     console.error(err);
  //     setReportingStatus('error');
  //   }
  // };

  // return (
  //   <div className="h-full p-3 text-xs text-gray-700">
  //     <GFML text={`Reporting "${current.entry.title}" as ...`} className="mb-4 font-semibold" />

  //     {ReportTypeOptions.map((rt) => (
  //       <div key={rt}>
  //         <Radio checked={rt === reportType} onChange={(e) => e.target.checked && setReportType(rt)}>
  //           {ReportTypeMeta[rt].label}
  //         </Radio>
  //         <p className="mt-1 text-xs text-gray-500">{ReportTypeMeta[rt].desc}</p>
  //       </div>
  //     ))}

  //     <TextArea
  //       className="mb-1 w-full"
  //       placeholder="Additional explanation..."
  //       value={reportDesc}
  //       onChange={(e) => setReportDesc(e.target.value)}
  //       rows={3}
  //       spellCheck={false}
  //       maxLength={1024}
  //     />

  //     <div className="mb-1 flex flex-col gap-1">
  //       <Button disabled={btnDisabled} onClick={handleSubmit} className="w-full justify-center">
  //         {reportingStatus === 'submitting' ? 'Sending...' : 'Report'}
  //       </Button>
  //       <Button
  //         minimal
  //         className="w-full justify-center"
  //         onClick={() => {
  //           goToBrowse(current.entry);
  //           analytics.events.track('report.cancel', {
  //             entryId: current.entry.id,
  //             title: current.entry.title,
  //             authorId: current.entry.createdBy.id,
  //             authorDisplayName: current.entry.createdBy.displayName,
  //           });
  //         }}
  //       >
  //         Cancel
  //       </Button>
  //     </div>

  //     {reportingStatus === 'error' && <p>Something went wrong. Please try again.</p>}
  //   </div>
  // );
};
