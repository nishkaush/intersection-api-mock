var app = new Vue({
  el: "#app",
  data: {
    people: [],
    observer: null,
    pageToFetch: 1,
    showStickyHeader: false,
    isLoading: false,
    stickyHeaderObserver: null
  },
  async mounted() {
    this.fetchPeople();
    this.createStickyHeaderObserver();
  },
  watch: {
    pageToFetch() {
      this.createObserver();
    }
  },
  methods: {
    fetchPeople() {
      let vm = this;
      if (this.isLoading) return; //ensures we aren't running parallel requests
      this.isLoading = true;
      axios
        .get(`https://reqres.in/api/users?page=${this.pageToFetch}`)
        .then(res => {
          this.removeObserver(); // so we can re-attach it later to the last person
          this.isLoading = false;
          if (res.data.data.length) {
            this.people = [...this.people, ...res.data.data];
            this.$nextTick(() => (this.pageToFetch += 1));
          }
        })
        .catch(err => console.log("erroooorrr--->", err));
    },
    createObserver() {
      let vm = this;
      // console.log(document.querySelectorAll(".person-entry"));
      this.observer = new IntersectionObserver(vm.handleIntersection, {
        root: null,
        threshold: 0.5
      });
      // const elementsArr = document.querySelectorAll(".person-entry");
      // const lastElement = elementsArr[elementsArr.length - 1];
      // this.observer.observe(lastElement);
      // this.observer.observe(document.querySelector("#target-to-observe"));
      this.observer.observe(document.querySelector(".person-entry:last-child"));
    },
    handleIntersection(entries) {
      console.log("entries", entries);
      if (entries[0].isIntersecting) {
        this.fetchPeople();
      }
    },
    removeObserver() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    },
    createStickyHeaderObserver() {
      let vm = this;
      // console.log(document.querySelectorAll(".person-entry"));
      this.stickyHeaderObserver = new IntersectionObserver(
        vm.handleStickyHeaderIntersection,
        {
          root: null,
          threshold: 0
        }
      );
      this.stickyHeaderObserver.observe(document.querySelector("#main-header"));
    },
    handleStickyHeaderIntersection(entries) {
      // console.log("entries", entries);
      this.showStickyHeader = entries[0].isIntersecting ? false : true;
    }
  }
});
