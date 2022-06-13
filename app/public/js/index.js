const indexMudule = (() => {
    const path = window.location.pathname

    switch (path) {
        case '/':
              //検索ボタンのイベント設定
    document.getElementById('search-btn').addEventListener('click', () => {
        return searchMoudule.searchUsers()
    })
    return usersMoudule.fetchAllUsers()
          
    case '/create.html':
        document.getElementById('save-btn').addEventListener('click', () => {
            return usersMoudule.createUser()
        })
        document.getElementById('cancel-btn').addEventListener('click', () => {
            return window.location.href = '/'
        })
        break;

        case '/edit.html':
            const uid = window.location.search.split('?uid=')[1]//window.location.searchでパラメータを受け取る splitで分けて配列にする

            document.getElementById('save-btn').addEventListener('click', () => {
                return usersMoudule.saveUser(uid)
            })
            document.getElementById('cancel-btn').addEventListener('click', () => {
                return window.location.href = '/'
            })
            document.getElementById('delete-btn').addEventListener('click', () => {
                return usersMoudule.deleteUser(uid)
            })
         
            return usersMoudule.setExistingValue(uid)

        default:
            break;
    }
})()