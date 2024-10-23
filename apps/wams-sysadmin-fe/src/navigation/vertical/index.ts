// ** Type import
import {VerticalNavItemsType} from 'template-shared/@core/layouts/types'

const Navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: 'Apps & Pages'
    },
    {
      title: 'System',
      icon: 'grommet-icons:system',
      children: [
        {
          icon: 'grommet-icons:user',
          title: 'Account.Account',
          path: '/apps/account-management/list'
        },
        {
          icon: 'carbon:customer',
          title: 'Customer.Customer',
          path: '/apps/customer/list'
        },
        {
          icon: 'gridicons:domains',
          title: 'Domain.Domain',
          path: '/apps/domain'
        },
        {
          icon: 'streamline:application-add',
          title: 'Application.Application',
          path: '/apps/application'
        },
        {
          icon: 'eos-icons:role-binding-outlined',
          title: 'Role.Role',
          path: '/apps/role-account/list'
        },
        {
          icon: 'material-symbols:inbox-customize-outline',
          title: 'Parameter.Parameter',
          path: '/apps/app-parameter'
        },

        {
          icon: 'fluent:table-copy-20-filled',
          title: 'Annex.Annex',
          path: '/apps/annex'
        }
      ]
    },
    {
      title: 'Security.Security',
      icon: 'mdi:security-lock-outline',
      children: [
        {
          icon: 'solar:password-linear',
          title: 'Password.Password',
          path: '/apps/password-config/list'
        },
        {
          icon: 'mdi:encryption-check-outline',
          title: 'PEB.PEB',
          path: '/apps/peb-config/list'
        },
        {
          icon: 'mdi:encryption-alert-outline',
          title: 'Digest.Digest',
          path: '/apps/digest-config/list'
        },
        {
          icon: 'ri:token-swap-line',
          title: 'Token.Token',
          path: '/apps/Token-management/list'
        }
      ]
    },
    {
      title: 'Storage.Storage',
      icon: 'oui:storage',
      children: [
        {
          icon: 'file-icons:config',
          title: 'Storage.Config',
          path: '/apps/storage-configuration'
        }
      ]
    },
    {
      title: 'Messaging',
      icon: 'eva:message-square-outline',
      children: [
        {
          icon: 'fluent:mail-template-20-regular',
          title: 'Template.Template',
          path: '/apps/template/list'
        },
        {
          icon: 'file-icons:config',
          title: 'Config.Config',
          path: '/apps/config/list'
        }
      ]
    }
  ]
}
export default Navigation
