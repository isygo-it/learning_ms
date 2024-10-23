import {useMutation} from 'react-query'
import {PropertyTypes} from '../types/apps/propertyTypes'
import {updateProperty} from '../@core/api/property'
import localStorageKeys from '../configs/localeStorage'

interface UpdatePropertyProps {
    guiName: string
}

interface UpdatePropertyResult {
    handleSaveChangeWithName: (expanded: boolean, name: string) => void
}

const useUpdateProperty = (props: UpdatePropertyProps): UpdatePropertyResult => {
    function handleSaveChangeWithName(expanded: boolean, name: string) {
        if (getAccountCode() !== null) {
            const dataProperty: PropertyTypes = {
                name: name,
                guiName: props.guiName,
                value: expanded.toString()
            }
            mutationProperty.mutate(dataProperty)
        } else {
            console.error('Account code not found in local storage')
        }
    }

    function getAccountCode(): string {
        const currentUser = window.localStorage.getItem(localStorageKeys.userData)

        if (currentUser) {
            if (JSON.parse(currentUser)) {
                return JSON.parse(currentUser).userName
            }
        }

        return ''
    }

    const mutationProperty = useMutation({
        mutationFn: (dataProperty: PropertyTypes) => updateProperty(dataProperty, getAccountCode()),
        onSuccess: res => {
            console.log('onSuccess', res)
        },
        onError: err => {
            console.log(err)
        }
    })

    return {handleSaveChangeWithName}
}

export default useUpdateProperty
