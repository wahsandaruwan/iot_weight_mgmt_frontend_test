import React from 'react'
import { useTheme } from '@mui/material'
import { tokens } from '../../theme'
import { ResponsivePie } from '@nivo/pie'
import { voltageData } from '../../data/chartData'

const PieChartVoltage = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  return (
    <ResponsivePie
      data={voltageData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      margin={{ top: 20, right: 40, bottom: 60, left: 40 }}
      innerRadius={0.5}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      colors={{ scheme: 'reds' }}
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', '0.4']],
      }}
      enableArcLinkLabels={false}
      legends={[
        {
          anchor: 'top-left',
          direction: 'column',
          justify: false,
          translateX: -35,
          translateY: 0,
          itemsSpacing: 0,
          itemWidth: 100,
          itemHeight: 20,
          itemTextColor: colors.grey[100],
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: colors.grey[200],
              },
            },
          ],
        },
      ]}
    />
  )
}
export default PieChartVoltage
