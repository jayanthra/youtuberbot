var app = new Vue({
  el: '#app',
  data: {
    stories: [],
    isLoading: false,
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const resp = await fetch('http://localhost:3000/getstory')
      this.stories = await resp.json()
    },
    async createStory(story) {
      this.isLoading = true
      const { title, selftext, url } = story
      const payload = {
        title,
        selftext,
        url
      }
      const resp = await fetch('http://localhost:3000/create', {
        method: 'POST', 
        mode: 'cors', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload) // body data type must match "Content-Type" header
      });
      const jsonRes = await resp.json()
      this.isLoading = false
      console.log(jsonRes)
    }
  }
})