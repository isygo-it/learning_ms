// ** Type import
import {VerticalNavItemsType} from 'template-shared/@core/layouts/types'

const Navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: 'Apps & Pages'
    },
    {
      title: 'Topic',
      icon: 'ic:baseline-topic',
      path: '/apps/topic'
    },
    {
      title: 'Article',
      icon: 'material-symbols:article-shortcut-outline',
      path: '/apps/article'
    },
    {
      title: 'Author',
      icon: 'material-symbols:man-rounded',
      path: '/apps/author'
    },
    {
      title: 'Quiz.Quiz',
      icon: 'tabler:file',
      path: '/apps/quiz'
    },

    {
      title: 'TopicFront',
      icon: 'material-symbols:eye-rounded',
      path: '/apps/topicfront'
    }
  ]
}
export default Navigation
