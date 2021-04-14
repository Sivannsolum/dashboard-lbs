<template>
    <div class="etc">
        <!-- privacy policy 팝업 -->
        <v-dialog
            v-model="dialog_privacy"
            width="650"
        >
            <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on">{{ $t('Privacy Policy') }}</v-btn>
            </template>

            <v-card class="popup add_store_popup">
            <h3 class="page-title-bar"><i class="ico ico-info"></i>{{ $t('Privacy Policy') }}</h3>

            <div class="termsBox" id="terms">
            <p>SOLUM CO., LTD("We") respect your concerns about privacy. This Privacy Policy applies to the personal information we collect in connection with the services we provide, including in relation to our application and the use of Dashboard (the “Application”).<p><br>

            <h4 class="article1">OVERVIEW OF PRIVACY POLICY</h4>
            ========================================<br><br>
            <p>In this Privacy Policy, we describe the types of personal information we process in relation to the Services, how we use the personal information, how long we retain the personal information and the choices available to you and your rights regarding the use of your personal information, including the right to object to some of the processing we carry out. More information about your rights, and how to exercise them, is set out in the Your Rights section below. This Privacy Policy will also tell you how to contact us about our privacy practices. Below is a list of key topics addressed in this Privacy Policy. For more detailed information on how we process your personal information, please click on each heading or continue to read below.</p><br>

            <h5 class="article2 underline">
                <v-btn text
                    @click="$vuetify.goTo('#anchor1', { container: '#terms' })"
                    class="termsLink"
                >1. Collection of Personal Information</v-btn>
            </h5><br>
            <h5 class="article2 underline">
                <v-btn text
                    @click="$vuetify.goTo('#anchor2', { container: '#terms' })"
                    class="termsLink"
                >2. Use of Personal Information</v-btn>
            </h5><br>
            <h5 class="article2 underline">
                <v-btn text
                    @click="$vuetify.goTo('#anchor3', { container: '#terms' })"
                    class="termsLink"
                >3. Retention of Personal Information</v-btn>
            </h5><br>
            <h5 class="article2 underline">
                <v-btn text
                    @click="$vuetify.goTo('#anchor4', { container: '#terms' })"
                    class="termsLink"
                >4. Your Rights</v-btn>
            </h5><br>
            <h5 class="article2 underline">
                <v-btn text
                    @click="$vuetify.goTo('#anchor5', { container: '#terms' })"
                    class="termsLink"
                >5. Protection of Personal Information</v-btn>
            </h5><br>
            <h5 class="article2 underline">
                <v-btn text
                    @click="$vuetify.goTo('#anchor6', { container: '#terms' })"
                    class="termsLink"
                >6. Updates to Privacy Policy</v-btn>
            </h5><br>
            <h5 class="article2 underline">
                <v-btn text
                    @click="$vuetify.goTo('#anchor7', { container: '#terms' })"
                    class="termsLink"
                >7. Contact Us</v-btn>
            </h5><br><br><br>

            <h5 class="article2" id="anchor1">1. Collection of Personal Information</h5>
            <ul class="list-bullet mt-2">
                <li>* Information you provide to us through your relationship with us, including but not limited to information provided by you when using the application, we collect the name and the email address when you create the account for accessing to our application.</li>
                <li>* Information such as IP address of the system which you access to our application and date/time log of your visit to the application.</li>
            </ul><br>

            <h5 class="article2" id="anchor2">2. Use of Personal Information</h5>
            <p class="mt-2">In this section we provide the legal ground on which we rely to process your personal information and under each legal ground, we explain the purposes for which we collect and use your personal information.</p><br>
            <h6 class="article2 underline">Provision of Services based on your contractual relationship with us</h6><br>
            <ul class="list-bullet mt-2">
                <li>* Provide you with the Services on Dashboard</li>
                <li>* Identify and authenticate you so you may use certain services</li>
            </ul><br>
            <h6 class="article2 underline">Use of information based on legitimate interests of us</h6><br>
            <ul class="list-bullet mt-2">
                <li>* Generate the report for informing the abnormal situation of our system you manage and send it to you.</li>
            </ul><br>
            <h6 class="article2 underline">Use of information based on your consent</h6><br>
            <p>This data will not be forwarded to third parties without your express consent.</p><br>
            <h6 class="article2 underline">Change of purpose</h6><br>
            <p>We will use your personal information for the purposes for which we collected it, unless we reasonably consider that we need to use it for another reason and that reason is compatible with the original purpose. If we need to use your personal information for an unrelated purpose, we will notify you and we will explain the legal basis which allows us to do so.</p><br>
            <h6 class="article2 underline">For purposes which are required by law:</h6><br>
            <ul class="list-bullet mt-2">
                <li>* Comply with and enforce applicable legal requirements; or </li>
                <li>* Respond to requests from government or law enforcement</li>
            </ul><br>

            <h5 class="article2" id="anchor3">3. Retention of Personal Information</h5>
            <p class="mt-2">We will take appropriate measures to ensure that we only process and retain your information for the duration as required:</p>
            <ul class="list-bullet">
                <li>* to provide you with the Services;</li>
            </ul>
            <p>When you no longer need to use our system, you can remove your account information in our system.</p><br>

            <h5 class="article2" id="anchor4">4. Your rights</h5>
            <p class="mt-2">Your personal information belongs to you. To the extent permitted under applicable laws, you may ask us to identify the personal information we have collected from you, and request that we delete it or correct any inaccuracies. You can also ask us to restrict or limit the processing of your personal information, as well as, to provide your personal information for a contract or in a structured, machine readable format, and to share (port) this data to another data controller.</p>
            <p class="mt-2">In addition, to the extent permitted under applicable laws, you can <sup>object to the processing</sup> of your personal data in some circumstances (in particular, where we don’t have to process the data to meet a contractual or other legal requirement). </p>
            <p class="mt-2">These <strong>rights may be limited,</strong> for example, if fulfilling your request would reveal personal data about another person, where they would infringe the rights of a third party (including our rights) or if you ask us to delete information which we are required by law to keep or have compelling legitimate interests in keeping. Relevant exemptions are included in both the GDPR and in equivalent national laws. We will inform you of relevant exemptions that we rely upon, if relevant, when responding to requests that you make. To exercise your rights or to make an inquiry, see the <span class="textline"><v-btn text @click="$vuetify.goTo('#anchor7', { container: '#terms' })" class="innerLink">Contact Us</v-btn></span> section below.</p><br>

            <h5 class="article2" id="anchor5">5. Protection of Personal Information</h5>
            <p class="mt-2">If our application is located in your internal network, such as the data center, the information is not exposed to any party. If our application is located in the public cloud, such as MS Azure, the information is protected by the security services provided by the cloud service provider. However, please note that although our system uses several services to protect your information, no website, Internet transmission, computer system, or wireless connection is completely secure.</p><br>

            <h5 class="article2" id="anchor6">6. Updates to this Privacy Policy</h5>
            <p class="mt-2">This Privacy Policy may be updated to reflect changes in our personal information practices with respect to the Services, or changes in the applicable law. We will display also the dates on which the policy was most recently updated so that you can catch the change of the policy.</p><br>

            <h5 class="article2" id="anchor7">7. Contact Us</h5>
            <p class="mt-2">If you have any queries in relation to this Privacy Policy or to exercise your rights in relation to your personal information, please contact us at eslsupport@solu-m.com or via post A-tower 6 Floor, 357, Guseong-ro, Giheung-gu, Yongin-si, Gyeonggi-do, Republic of Korea. In addition, the Data Protection Officer can be contacted <span class="textline">using boyle.seo@solu-m.com</span>. You can also contact the competent data protection authority that is the responsible supervisory authority.</p>
            </div>

            <v-card-actions class="d-flex justify-center">
            <v-btn text icon @click="dialog_privacy = false" class="btn">Close</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
        <p>Copyright 2021 SOLUM</p>
    </div>
</template>

<script>
export default {
  data () {
    return {
      dialog_privacy: false
    }
  }
}
</script>

<style>

</style>
