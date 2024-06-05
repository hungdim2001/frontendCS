// @mui
import { styled } from '@mui/material/styles';
import {
  Grid,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  AccordionSummary,
  Accordion,
  AccordionDetails,
} from '@mui/material';
// components
import Page from '../components/Page';
// sections
import { FaqsHero, FaqsCategory, FaqsList, FaqsForm } from '../sections/faqs';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { PATH_ROOT } from 'src/routes/paths';
import Image from '../components/Image';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));

// ----------------------------------------------------------------------
const faqData = [
  {
    category: 'Trust & Safety',
    questions: [
      {
        question: 'Can I purchase products from Tech Heim using installment payments?',
        answer:
          'Yes, Tech Heim offers the option to purchase products using both cash and installment payments. This allows you to choose the payment method that suits your needs and budget.',
      },
      {
        question: 'How can I engage with the magazine content on Tech Heim?',
        answer:
          'You can actively engage with the magazine content by leaving comments and participating in the question-and-answer section. Feel free to share your thoughts, ask questions, and interact with fellow tech enthusiasts in the community.',
      },
      {
        question: 'Does Tech Heim offer a warranty on its products?',
        answer:
          'Yes, Tech Heim provides a warranty on all eligible products. The specific warranty details may vary depending on the manufacturer and product category. Please refer to the product description or contact our customer support for more information.',
      },
      {
        question: 'Is Tech Heim a secure platform for online shopping?',
        answer:
          'Yes, Tech Heim provides a warranty on all eligible products. The specific warranty details may vary depending on the manufacturer and product category. Please refer to the product description or contact our customer support for more information.',
      },
      {
        question: 'How can I get assistance with my purchase or any other inquiries?',
        answer:
          "If you need assistance with your purchase or have any questions, our dedicated customer support team is here to help. You can reach out to us through the contact page on our website, and we'll be happy to assist you promptly.",
      },
    ],
  },
];
export default function Faqs() {
  return (
    <Page title="Faqs">
      <RootStyle>
        {/* <FaqsHero /> */}

        <Container>
          <HeaderBreadcrumbs
            heading=""
            links={[
              { name: 'Home', href: '/' },
              {
                name: 'Faqs',
                href: PATH_ROOT.faq.root,
              },
            ]}
          />
          <Image sx={{ margin: 'auto' }} alt="faq" src="/img/faq.png" />

          <Grid container spacing={3}>
            <Grid item xs={12} md={2}>
              <Typography variant="h5" sx={{marginTop:'16px'}}>Table of Contents</Typography>
              <Typography variant="body2"sx={{marginTop:'12px'}} color={'primary'} >General</Typography>
            </Grid>
            <Grid item xs={12} md={10}>
              <List component="nav">
                {faqData.map((section, index) => (
                  <React.Fragment key={index}>
                    {/* <ListItem>
                      <ListItemText primary={section.category} />
                    </ListItem> */}
                    {section.questions.map((faq, i) => (
                      <Accordion key={i}>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls={`panel${i}-content`}
                          id={`panel${i}-header`}
                        >
                          <Typography variant="h5" color={'primary'}>
                            {faq.question}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>{faq.answer}</Typography>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </React.Fragment>
                ))}
              </List>
            </Grid>
          </Grid>
          {/* <FaqsCategory />

          <Typography variant="h3" sx={{ mb: 5 }}>
            Frequently asked questions
          </Typography>

          <Grid container spacing={10}>
            <Grid item xs={12} md={6}>
              <FaqsList />
            </Grid>
            <Grid item xs={12} md={6}>
              <FaqsForm />
            </Grid>
          </Grid> */}
        </Container>
      </RootStyle>
    </Page>
  );
}
