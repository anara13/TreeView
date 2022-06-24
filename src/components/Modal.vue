<!-- Récupérer ici: https://alligator.io/vuejs/vue-modal-component/ -->
<template>
    <transition name="modal-fade">

        <div class="modal-backdrop">

            <div class="modal">

            <header class="modal-header">
                <slot name="header">
                    <button type="button" class="btn-close" @click="close">
                        x
                    </button>

                </slot>
            </header>

            <section class="modal-body">
                <slot name="body">
                </slot>
            </section>

            <footer class="modal-footer">
                <slot name="footer">

                    <button type="button" class="btn-green" @click="close">
                        Close
                    </button>
                </slot>
            </footer>

            </div>
        </div>
    </transition>
</template>

<script>
/* eslint-disable */

  export default {
    name: 'modal',

    methods: {
      close() {
        this.$emit('close');
      },
    },
  };
</script>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    /*border-bottom: 1px solid #eeeeee;*/
    color: #4AAE9B;
    justify-content: space-between;
  }

  .modal-footer {
    /*border-top: 1px solid #eeeeee;*/
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn-close {
    border: none;
    font-size: 20px;
    padding: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }

   .modal-fade-enter,
  .modal-fade-leave-active {
    opacity: 0;
  }

  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity .1s ease
  }
</style>