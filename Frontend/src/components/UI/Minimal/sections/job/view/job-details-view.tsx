import type { IJobItem } from '@/components/UI/Minimal/types/job';

import { useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from '@/components/UI/Minimal/routes/paths';

import { useTabs } from '@/components/UI/Minimal/hooks//use-tabs';

import { DashboardContent } from '@/components/UI/Minimal/layouts/dashboard';
import { JOB_DETAILS_TABS, JOB_PUBLISH_OPTIONS } from '@/components/UI/Minimal/_mock';

import { Label } from '@/components/UI/Minimal/components/label';

import { JobDetailsToolbar } from '../job-details-toolbar';
import { JobDetailsContent } from '../job-details-content';
import { JobDetailsCandidates } from '../job-details-candidates';

// ----------------------------------------------------------------------

type Props = {
  job?: IJobItem;
};

export function JobDetailsView({ job }: Props) {
  const tabs = useTabs('content');

  const [publish, setPublish] = useState(job?.publish);

  const handleChangePublish = useCallback((newValue: string) => {
    setPublish(newValue);
  }, []);

  const renderTabs = (
    <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
      {JOB_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.value === 'candidates' ? (
              <Label variant="filled">{job?.candidates.length}</Label>
            ) : (
              ''
            )
          }
        />
      ))}
    </Tabs>
  );

  return (
    <DashboardContent>
      <JobDetailsToolbar
        backLink={paths.dashboard.job.root}
        editLink={paths.dashboard.job.edit(`${job?.id}`)}
        liveLink="#"
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={JOB_PUBLISH_OPTIONS}
      />
      {renderTabs}

      {tabs.value === 'content' && <JobDetailsContent job={job} />}

      {tabs.value === 'candidates' && <JobDetailsCandidates candidates={job?.candidates ?? []} />}
    </DashboardContent>
  );
}
