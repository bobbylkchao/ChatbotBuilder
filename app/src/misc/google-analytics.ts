import ReactGA from 'react-ga4'

export const initGoogleAnalytics = () => {
  if (process.env.REACT_APP_GOOGLE_GA_ID) {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_GA_ID)
  }
}

export const gaSendPageView = (pageUrl: string, context: object) => {
  if (ReactGA.isInitialized) {
    ReactGA.send({
      hitType: 'pageview',
      page: pageUrl,
      ...context,
    })
  }
}

export const gaSendClickEvent = (type: string, buttonName: string) => {
  if (ReactGA.isInitialized) {
    ReactGA.event('button_click', {
      type,
      buttonName,
    })
  }
}

export const gaSendEventData = (eventName: string, context: object) => {
  if (ReactGA.isInitialized) {
    ReactGA.event(eventName, context)
  }
}
